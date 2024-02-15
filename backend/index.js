const express = require("express");
const { STRIPE_SECRET_KEY } = require("./constants");
const app = express();
const stripe = require("stripe")(STRIPE_SECRET_KEY);

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8100");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post("/payment", async (req, res) => {
  const { products, routes } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.amount * 100,
        },
        quantity: product.quantity,
      })),
      mode: "payment",
      success_url: routes.success_url,
      cancel_url: routes.cancel_url,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      automatic_tax: { enabled: true },
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).send("Error creating payment session");
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
