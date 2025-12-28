import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const signup = mutation({
    args: { username: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();

        if (existing) {
            throw new Error("Username already taken");
        }

        const userId = await ctx.db.insert("users", {
            username: args.username,
            password: args.password,
            createdAt: Date.now(),
        });

        return userId;
    },
});

export const login = mutation({
    args: { username: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();

        if (!user || user.password !== args.password) {
            return null;
        }

        return user._id;
    },
});
