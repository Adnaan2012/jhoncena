import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveScore = mutation({
    args: { game: v.string(), score: v.number(), username: v.string() },
    handler: async (ctx, args) => {
        // Optional: check if high score for user? Or just log all.
        // Let's just log all for now.
        await ctx.db.insert("scores", {
            game: args.game,
            score: args.score,
            username: args.username,
            createdAt: Date.now(),
        });
    },
});

export const getTopScores = query({
    args: { game: v.string() },
    handler: async (ctx, args) => {
        // Get top 10 scores
        // Note: complex sorting might need defining index carefully or processing in JS if small scale.
        // Convex indexes support ordering.
        // defineTable(...).index("by_game_score", ["game", "score"])

        // We want descending order of score.
        const scores = await ctx.db
            .query("scores")
            .withIndex("by_game_score", (q) => q.eq("game", args.game))
            .order("desc")
            .take(10);

        return scores;
    },
});
