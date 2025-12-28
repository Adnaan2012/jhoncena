import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

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
        const userId = session.metadata?.userId;

        if (userId) {
            await ctx.runMutation(internal.users.fulfillPurchase, {
                userId: userId as any
            });
        }
    }

    return new Response(null, { status: 200 });
});
