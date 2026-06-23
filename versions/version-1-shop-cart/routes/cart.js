const express = require("express");
const router = express.Router();

function getCart(req) {
  try {
    return JSON.parse(req.signedCookies.cart || "[]");
  } catch {
    return [];
  }
}

function saveCart(res, cart) {
  res.cookie("cart", JSON.stringify(cart), {
    signed: true,
    httpOnly: true,
    sameSite: "strict",
  });
}

router.post("/add/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const requestedQuantity = Math.max(1, parseInt(req.body.quantity || "1"));
  const products = req.app.locals.products;
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Produkt nicht gefunden" });
  if (!product.orderInfo.available || product.orderInfo.stock <= 0) {
    return res.status(400).json({ error: "Produkt nicht verfügbar" });
  }

  const cart = getCart(req);
  const existing = cart.find((item) => item.productId === id);
  const existingQuantity = existing ? existing.quantity : 0;
  const quantity = Math.min(requestedQuantity, product.orderInfo.stock - existingQuantity);
  if (quantity <= 0) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    return res.json({ cartCount: total, maxReached: true });
  }

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId: id, quantity });
  }
  saveCart(res, cart);

  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ cartCount: total });
});

router.post("/remove/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let cart = getCart(req);
  cart = cart.filter((item) => item.productId !== id);
  saveCart(res, cart);

  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (req.accepts("html") && !req.accepts("json")) {
    return res.redirect("/warenkorb");
  }
  res.json({ cartCount: total });
});

router.post("/clear", (req, res) => {
  saveCart(res, []);
  res.json({ cartCount: 0 });
});

module.exports = router;
