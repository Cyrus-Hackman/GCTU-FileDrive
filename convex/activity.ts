import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { hasAccessToOrg } from "./files";

export const getActivity = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    const logs = await ctx.db
      .query("activity_logs")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(50); // Get last 50 activities

    const logsWithDetails = await Promise.all(
      logs.map(async (log) => {
        const user = await ctx.db.get(log.userId);
        let file = null;
        if (log.fileId) {
          file = await ctx.db.get(log.fileId);
        }
        
        return {
          ...log,
          user: {
            name: user?.name,
            image: user?.image,
          },
          file: file ? {
            name: file.name,
            type: file.type,
          } : null,
        };
      })
    );

    return logsWithDetails;
  },
});
