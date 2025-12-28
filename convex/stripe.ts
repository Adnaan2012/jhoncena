import { v } from "convex/values";
import { action } from "./_generated/server";
import Stripe from "stripe";

export const createCheckoutSession = action({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const stripeSecret = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecret) {
            throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
        }

        const stripe = new Stripe(stripeSecret, {
            apiVersion: "2025-01-27-patch.1" as any,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Arcade.io Premium Membership",
                            description: "Unlock all premium games and features forever!",
                        },
                        unit_amount: 1999, // $19.99
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/`,
            metadata: {
                userId: args.userId,
            },
        });

        return session.url;
    },
});
