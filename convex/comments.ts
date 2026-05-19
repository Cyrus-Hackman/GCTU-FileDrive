import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAccessToOrg } from "./files";

export const addComment = mutation({
  args: {
    fileId: v.id("files"),
    orgId: v.string(),
    text: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("You do not have access to this org");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("File not found");
    }

    await ctx.db.insert("comments", {
      fileId: args.fileId,
      orgId: args.orgId,
      userId: hasAccess.user._id,
      text: args.text,
    });
    
    await ctx.db.insert("activity_logs", {
      orgId: args.orgId,
      userId: hasAccess.user._id,
      fileId: args.fileId,
      action: "commented on",
      details: args.text.substring(0, 50) + (args.text.length > 50 ? "..." : ""),
    });
  },
});

export const getComments = query({
  args: {
    fileId: v.id("files"),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
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
