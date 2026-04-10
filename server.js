const path = require("path");
const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 3000;

const PLAN_CONFIG = {
  Starter: { name: "Starter", unit_amount: 999 },
  Growth: { name: "Growth", unit_amount: 1999 },
  Premium: { name: "Premium", unit_amount: 4999 }
};

app.use(express.static(path.join(__dirname, ".")));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;

  if (!plan || !PLAN_CONFIG[plan]) {
    return res.status(400).json({ error: "Invalid purchase plan." });
  }

  const pricing = PLAN_CONFIG[plan];

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `FitFlow ${pricing.name} Plan`,
              description: `Monthly subscription for the FitFlow ${pricing.name} level.`
            },
            unit_amount: pricing.unit_amount
          },
          quantity: 1
        }
      ],
      success_url: `${req.headers.origin}/program.html?checkout=success`,
      cancel_url: `${req.headers.origin}/purchase.html?checkout=cancel`,
      metadata: {
        plan: pricing.name
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    res.status(500).json({ error: "Unable to create checkout session." });
  }
});

app.listen(PORT, () => {
  console.log(`FitFlow server running on http://localhost:${PORT}`);
});
