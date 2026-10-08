import prisma from "../../config/prisma.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.acacia" as any,
});

export const PaymentService = {
  initiatePayment: async (
    userId: string,
    appointmentId: string,
    amount: number,
  ) => {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { student: true, schedule: true },
    });

    if (!appointment || appointment.studentId !== userId) {
      throw new Error("Appointment not found or unauthorized");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "IELTS Booking Session",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    } as any);

    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        amount,
        transactionId: session.id,
        status: "PENDING",
      },
    });

    return { checkoutUrl: session.url, sessionId: session.id };
  },

  handleWebhookEvent: async (rawBody: Buffer, signature: string) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const appointmentId = session.metadata?.appointmentId;

      if (appointmentId) {
        await prisma.$transaction(async (tx) => {
          await tx.payment.updateMany({
            where: { transactionId: session.id },
            data: { status: "COMPLETED" },
          });

          await tx.appointment.update({
            where: { id: appointmentId },
            data: { status: "CONFIRMED" },
          });
        });
      }
    }

    return { received: true };
  },

  getUserPaymentsService: async (userId: string) => {
    return await prisma.payment.findMany({
      where: {
        appointment: {
          studentId: userId,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        appointment: {
          include: { schedule: true },
        },
      },
    });
  },
};
