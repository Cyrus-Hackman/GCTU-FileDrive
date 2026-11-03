import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import authConfig from "./auth.config";

const http = httpRouter();

// must match the tokenIdentifier Convex builds from the Clerk JWT: `${issuer}|${userId}`
const clerkIssuer = authConfig.providers[0].domain;

function toTokenIdentifier(userId: string) {
  return `${clerkIssuer}|${userId}`;
}

function toFullName(firstName: string | null, lastName: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: toTokenIdentifier(result.data.id),
            name: toFullName(result.data.first_name, result.data.last_name),
            image: result.data.image_url,
          });
          break;
        case "user.updated":
          await ctx.runMutation(internal.users.updateUser, {
            tokenIdentifier: toTokenIdentifier(result.data.id),
            name: toFullName(result.data.first_name, result.data.last_name),
            image: result.data.image_url,
          });
          break;
        case "organizationMembership.created":
          await ctx.runMutation(internal.users.addOrgIdToUser, {
            tokenIdentifier: toTokenIdentifier(
              result.data.public_user_data.user_id
            ),
            orgId: result.data.organization.id,
            role: result.data.role === "org:admin" ? "admin" : "member",
          });
          break;
        case "organizationMembership.updated":
          await ctx.runMutation(internal.users.updateRoleInOrgForUser, {
            tokenIdentifier: toTokenIdentifier(
              result.data.public_user_data.user_id
            ),
            orgId: result.data.organization.id,
            role: result.data.role === "org:admin" ? "admin" : "member",
          });
          break;
        case "organizationMembership.deleted":
          await ctx.runMutation(internal.users.removeOrgIdFromUser, {
            tokenIdentifier: toTokenIdentifier(
              result.data.public_user_data.user_id
            ),
            orgId: result.data.organization.id,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.error("Clerk webhook failed:", err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
