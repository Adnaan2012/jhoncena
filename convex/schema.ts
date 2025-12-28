import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        password: v.string(), // In a real app, hash this!
        createdAt: v.number(),
        isPremium: v.optional(v.boolean()),
    }).index("by_username", ["username"]),

    scores: defineTable({
        username: v.string(), // Denormalizing name for display
        game: v.string(),
        score: v.number(),
        createdAt: v.number(),
    }).index("by_game_score", ["game", "score"]),
});
