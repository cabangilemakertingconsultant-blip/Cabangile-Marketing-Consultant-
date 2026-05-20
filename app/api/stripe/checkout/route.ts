import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20"
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const slug = formData.get("slug");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Product" },
          unit_amount: 2000
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`
  });

  return Response.json({ url: session.url });
}