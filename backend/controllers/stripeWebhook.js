import stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

const markBookingAsPaid = async (bookingId) => {
  if (!bookingId) {
    console.log("[StripeWebhook] markBookingAsPaid skipped: bookingId missing");
    return;
  }

  console.log("[StripeWebhook] Updating booking as paid:", bookingId);

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { isPaid: true, paymentLink: "" },
    { new: true }
  );

  if (!booking) {
    console.log("[StripeWebhook] Booking not found for bookingId:", bookingId);
    return;
  }

  console.log("[StripeWebhook] Booking updated. isPaid:", booking.isPaid);

  await inngest.send({
    name: "app/show.booked",
    data: { bookingId: booking._id.toString() },
  });

  console.log("[StripeWebhook] Confirmation event queued for bookingId:", booking._id.toString());
};

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  console.log("[StripeWebhook] Incoming webhook. signature present:", Boolean(sig));

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("[StripeWebhook] Event verified:", event.type, "id:", event.id);
  } catch (error) {
    console.log("[StripeWebhook] Signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const bookingId =
          session?.metadata?.bookingId || session?.client_reference_id;

        console.log(
          "[StripeWebhook] Checkout session received. sessionId:",
          session?.id,
          "bookingId:",
          bookingId
        );

        if (!bookingId) {
          console.log("Booking ID missing in checkout session metadata");
          break;
        }

        await markBookingAsPaid(bookingId);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent?.metadata?.bookingId;

        console.log(
          "[StripeWebhook] PaymentIntent succeeded. paymentIntentId:",
          paymentIntent?.id,
          "metadata bookingId:",
          bookingId
        );

        if (bookingId) {
          await markBookingAsPaid(bookingId);
          break;
        }

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        const session = sessionList.data[0];
        const fallbackBookingId =
          session?.metadata?.bookingId || session?.client_reference_id;

        console.log(
          "[StripeWebhook] Fallback session lookup. sessionId:",
          session?.id,
          "fallback bookingId:",
          fallbackBookingId
        );

        await markBookingAsPaid(fallbackBookingId);

        break;
      }
      default:
        console.log("Unhandled event type:", event.type);
    }
    res.json({ received: true });
  } catch (error) {
    console.log("Error handling webhook event:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
