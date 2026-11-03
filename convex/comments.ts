import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAccessToFile } from "./files";

const MAX_COMMENT_LENGTH = 1000;

export const addComment = mutation({
  args: {
    fileId: v.id("files"),
    text: v.string(),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("You do not have access to this file");
    }

    const text = args.text.trim();

    if (!text) {
      throw new ConvexError("Comment cannot be empty");
    }

    if (text.length > MAX_COMMENT_LENGTH) {
      throw new ConvexError(
        `Comment cannot be longer than ${MAX_COMMENT_LENGTH} characters`
      );
    }

    await ctx.db.insert("comments", {
      fileId: access.file._id,
      orgId: access.file.orgId,
      userId: access.user._id,
      text,
    });

    await ctx.db.insert("activity_logs", {
      orgId: access.file.orgId,
      userId: access.user._id,
      fileId: access.file._id,
      action: "commented on",
      details: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
    });
  },
});

export const getComments = query({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      return [];
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_fileId", (q) => q.eq("fileId", args.fileId))
      .collect();

    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            name: user?.name,
            image: user?.image,
          },
        };
      })
    );

    return commentsWithUsers;
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new ConvexError("Comment not found");
    }

    if (comment.userId !== user._id) {
      throw new ConvexError("You can only delete your own comments");
    }

    await ctx.db.delete(args.commentId);
  },
});
