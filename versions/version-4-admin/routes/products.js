const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const products = req.app.locals.products;
  const { strength, taste, origin, maxPrice, weight, type } = req.query;

  let filtered = [...products];

  if (strength) {
    filtered = filtered.filter((p) => p.strength === parseInt(strength));
  }
  if (taste) {
    filtered = filtered.filter((p) => p.taste === taste);
  }
  if (origin) {
    filtered = filtered.filter((p) => p.origin === origin);
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
  }
  if (weight) {
    filtered = filtered.filter((p) => p.weight === parseInt(weight));
  }
  if (type) {
    filtered = filtered.filter((p) => p.kaffeesorte === type);
  }

  const allOrigins = [...new Set(products.map((p) => p.origin))];
  const allTastes = [...new Set(products.map((p) => p.taste))];
  const allWeights = [...new Set(products.map((p) => p.weight))].sort((a, b) => a - b);
  const allTypes = [...new Set(products.map((p) => p.kaffeesorte))];

  res.render("layout", {
    title: "Shop",
    body: "shop",
    products: filtered,
    allOrigins,
    allTastes,
    allWeights,
    allTypes,
    selectedStrength: strength || "",
    selectedTaste: taste || "",
    selectedOrigin: origin || "",
    selectedMaxPrice: maxPrice || "",
    selectedWeight: weight || "",
    selectedType: type || "",
  });
});

function buildCoffeeProfile(product) {
  if (product.coffeeProfile) {
    return [
      { label: "Stärke", value: product.coffeeProfile.strength || product.strength },
      { label: "Röstung", value: product.coffeeProfile.roast || 3 },
      { label: "Säure", value: product.coffeeProfile.acidity || 2 },
      { label: "Aroma", value: Math.min(5, Math.round(((product.coffeeProfile.strength || product.strength) + (product.coffeeProfile.roast || 3)) / 2)) },
    ];
  }

  const roastMap = {
    "Hell": 2,
    "Mittel-Hell": 3,
    "Mittel": 3,
    "Dunkel": 5,
  };
  const acidityMap = {
    "Fruchtig": 4,
    "Blumig": 3,
    "Mild": 1,
    "Schokoladig": 2,
    "Nussig": 2,
    "Karamellig": 2,
  };
  const aromaMap = {
    "Fruchtig": 5,
    "Blumig": 5,
    "Karamellig": 4,
    "Schokoladig": 4,
    "Nussig": 3,
    "Mild": 2,
  };
  const roast = roastMap[product.roastProfile.level] || 3;

  return [
    { label: "Stärke", value: product.strength },
    { label: "Röstung", value: roast },
    { label: "Säure", value: acidityMap[product.taste] || 2 },
    { label: "Aroma", value: aromaMap[product.taste] || 3 },
    { label: "Bitterkeit", value: Math.min(5, Math.max(1, Math.round((product.strength + roast) / 2))) },
  ];
}

router.get("/:id", (req, res) => {
  const products = req.app.locals.products;
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).render("layout", {
      title: "Produkt nicht gefunden",
      body: "<h1>404</h1><p>Produkt nicht gefunden.</p>",
    });
  }

  res.render("layout", {
    title: product.name,
    body: "product-detail",
    product,
    coffeeProfile: buildCoffeeProfile(product),
  });
});

module.exports = router;
