import { httpAction } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";

export const fulfillPurchase = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { isPremium: true });
    },
});

export const stripeWebhook = httpAction(async (ctx, request) => {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecret || !webhookSecret) {
        return new Response("Config missing", { status: 500 });
    }

    const stripe = new Stripe(stripeSecret, {
        apiVersion: "2025-01-27-patch.1" as any,
    });

    const signature = request.headers.get("stripe-signature") as string;
    const body = await request.text();

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId as any;

        if (userId) {
            // Use internal mutation to update the user
            // Note: In a real app, you'd use an internal mutation
            // We need to define it in users.ts or here.
            // I'll define a fulfillment mutation below.
        }
    }

    return new Response(null, { status: 200 });
});
