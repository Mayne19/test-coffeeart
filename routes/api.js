const express = require("express");
const router = express.Router();

/**
 * API-Routen für externe Partner.
 * Liefert Produktdaten im JSON-Format.
 */

router.get("/products", (req, res) => {
  const products = req.app.locals.products;
  const result = products.map((p) => ({
    id: p.id,
    name: p.name,
    kaffeesorte: p.kaffeesorte,
    origin: p.origin,
    weight: p.weight,
    price: p.price,
    orderInfo: p.orderInfo,
  }));
  res.json(result);
});

router.get("/products/:id", (req, res) => {
  const products = req.app.locals.products;
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ error: "Produkt nicht gefunden" });
  }

  res.json({
    id: product.id,
    name: product.name,
    kaffeesorte: product.kaffeesorte,
    origin: product.origin,
    weight: product.weight,
    price: product.price,
    orderInfo: product.orderInfo,
  });
});

module.exports = router;
