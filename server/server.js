const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const stripe = require("stripe")(
  "sk_test_51O5PESSHpvvOP5YacvxUhYHvLbsHtgX9x9jThVeJitA21kNPVDGVZ9ZkT5tiaPxfkzfOqHYT4YA0MYvL9KTG5b07006aa3p31Y"
);

app.post("/checkout", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: [item.product]
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:3004/success.html",
      cancel_url: "http://localhost:3004/cancel.html",
    });

    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

app.listen(3004, () => {
  console.log("app is running on port : 3004");
});
