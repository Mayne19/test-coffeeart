const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_DIR = path.join(__dirname, "..", "data");

function saveJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

router.get("/", (req, res) => {
  const products = req.app.locals.products;
  const articles = req.app.locals.articles;
  res.render("layout", {
    title: "CoffeeArt Bremen",
    body: "index",
    featuredProducts: products.slice(0, 4),
    featuredArticles: articles.slice(0, 3),
  });
});

router.get("/coffee-finder", (req, res) => {
  res.render("layout", {
    title: "Coffee Finder",
    body: "coffee-finder",
  });
});

router.post("/coffee-finder", (req, res) => {
  const { level, taste, method, strength, type } = req.body;
  const products = req.app.locals.products;
  const selectedTaste = taste || "";
  const selectedStrength = strength || "";
  const selectedType = type || "";

  let recommendation = products[0];

  if (selectedStrength === "stark" || selectedType === "Espresso") {
    const strong = products.filter(
      (p) => p.kaffeesorte === "Espresso" && p.strength >= 4
    );
    if (strong.length) recommendation = strong[0];
  } else if (selectedTaste === "Fruchtig" || selectedTaste === "Blumig") {
    const fruity = products.filter((p) => p.taste === selectedTaste);
    if (fruity.length) recommendation = fruity[0];
  } else if (selectedStrength === "mild" || selectedType === "Filterkaffee") {
    const mild = products.filter((p) => p.strength <= 2);
    if (mild.length) recommendation = mild[0];
  }

  res.render("layout", {
    title: "Deine Kaffee-Empfehlung",
    body: "coffee-finder",
    recommendation,
    submitted: true,
  });
});

router.get("/login", (req, res) => {
  if (res.locals.user) {
    if (res.locals.user.role === "employee") {
      return res.redirect("/mitarbeiter");
    }
    return res.redirect("/admin");
  }
  res.render("layout", {
    title: "Login",
    body: "login",
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = req.app.locals.users;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.cookie("userId", user.id, {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });
    if (user.role === "employee") {
      return res.redirect("/mitarbeiter");
    }
    return res.redirect("/admin");
  }

  res.render("layout", {
    title: "Login",
    body: "login",
    error: "Ungültige E-Mail oder falsches Passwort.",
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/");
});

router.get("/admin", (req, res) => {
  if (!res.locals.user) return res.redirect("/login");
  if (res.locals.user.role !== "admin") return res.redirect("/mitarbeiter");

  res.render("layout", {
    title: "Admin Dashboard",
    body: "admin",
    products: req.app.locals.products,
    articles: req.app.locals.articles,
    orders: req.app.locals.orders,
  });
});

router.get("/mitarbeiter", (req, res) => {
  if (!res.locals.user) return res.redirect("/login");
  if (res.locals.user.role !== "employee") return res.redirect("/admin");

  res.render("layout", {
    title: "Mitarbeiter Dashboard",
    body: "mitarbeiter",
    products: req.app.locals.products,
    orders: req.app.locals.orders,
  });
});

router.get("/admin/products/new", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  res.render("layout", { title: "Produkt hinzufügen", body: "admin-product-form", product: null });
});

router.post("/admin/products/new", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  const products = req.app.locals.products;
  const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
  const images = [req.body.image1].filter(Boolean);
  if (req.body.image2) images.push(req.body.image2);
  if (req.body.image3) images.push(req.body.image3);
  const product = {
    id: maxId + 1,
    name: req.body.name,
    kaffeesorte: req.body.kaffeesorte,
    origin: req.body.origin,
    taste: req.body.taste,
    strength: parseInt(req.body.strength) || 3,
    price: parseFloat(req.body.price) || 0,
    weight: parseInt(req.body.weight) || 250,
    image: req.body.image1 || "",
    images: images.length ? images : undefined,
    tagline: req.body.tagline || "",
    description: req.body.description || "",
    coffeeProfile: {
      strength: parseInt(req.body.strength) || 3,
      roast: parseInt(req.body.roast) || 3,
      acidity: parseInt(req.body.acidity) || 2,
    },
    roastProfile: {
      temperature: req.body.roastTemp || "200°C",
      duration: req.body.roastDuration || "12 Minuten",
      level: req.body.roastLevel || "Mittel",
    },
    preparationTips: req.body.preparationTips || "",
    orderInfo: { available: true, stock: parseInt(req.body.stock) || 0 },
  };
  products.push(product);
  saveJSON("products.json", products);
  res.redirect("/admin");
});

router.get("/admin/products/:id/edit", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  const products = req.app.locals.products;
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.redirect("/admin");
  res.render("layout", { title: "Produkt bearbeiten", body: "admin-product-form", product });
});

router.post("/admin/products/:id/edit", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  const products = req.app.locals.products;
  const idx = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (idx === -1) return res.redirect("/admin");
  const images = [req.body.image1].filter(Boolean);
  if (req.body.image2) images.push(req.body.image2);
  if (req.body.image3) images.push(req.body.image3);
  products[idx].name = req.body.name;
  products[idx].kaffeesorte = req.body.kaffeesorte;
  products[idx].origin = req.body.origin;
  products[idx].taste = req.body.taste;
  products[idx].strength = parseInt(req.body.strength) || 3;
  products[idx].price = parseFloat(req.body.price) || 0;
  products[idx].weight = parseInt(req.body.weight) || 250;
  products[idx].image = req.body.image1 || products[idx].image || "";
  products[idx].images = images.length ? images : undefined;
  products[idx].tagline = req.body.tagline || "";
  products[idx].description = req.body.description || "";
  products[idx].coffeeProfile = {
    strength: parseInt(req.body.strength) || 3,
    roast: parseInt(req.body.roast) || 3,
    acidity: parseInt(req.body.acidity) || 2,
  };
  products[idx].roastProfile = {
    temperature: req.body.roastTemp || products[idx].roastProfile.temperature || "200°C",
    duration: req.body.roastDuration || products[idx].roastProfile.duration || "12 Minuten",
    level: req.body.roastLevel || products[idx].roastProfile.level || "Mittel",
  };
  products[idx].preparationTips = req.body.preparationTips || "";
  products[idx].orderInfo.stock = parseInt(req.body.stock) || 0;
  saveJSON("products.json", products);
  res.redirect("/admin");
});

router.post("/admin/products/:id/delete", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  let products = req.app.locals.products;
  products = products.filter((p) => p.id !== parseInt(req.params.id));
  saveJSON("products.json", products);
  req.app.locals.products = products;
  res.redirect("/admin");
});

router.get("/admin/articles/new", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  res.render("layout", { title: "Artikel hinzufügen", body: "admin-article-form", article: null });
});

router.post("/admin/articles/new", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  const articles = req.app.locals.articles;
  const maxId = articles.reduce((m, a) => Math.max(m, a.id), 0);
  const article = {
    id: maxId + 1,
    title: req.body.title,
    author: req.body.author,
    date: req.body.date,
    category: req.body.category,
    image: req.body.image || "",
    excerpt: (req.body.content || "").slice(0, 120) + "...",
    content: req.body.content || "",
    coffeeInfo: req.body.coffeeInfo || "",
  };
  articles.push(article);
  saveJSON("articles.json", articles);
  res.redirect("/admin");
});

router.get("/admin/articles/:id/edit", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  const articles = req.app.locals.articles;
  const article = articles.find((a) => a.id === parseInt(req.params.id));
  if (!article) return res.redirect("/admin");
  res.render("layout", { title: "Artikel bearbeiten", body: "admin-article-form", article });
});

router.post("/admin/articles/:id/edit", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  const articles = req.app.locals.articles;
  const idx = articles.findIndex((a) => a.id === parseInt(req.params.id));
  if (idx === -1) return res.redirect("/admin");
  articles[idx].title = req.body.title;
  articles[idx].author = req.body.author;
  articles[idx].date = req.body.date;
  articles[idx].category = req.body.category;
  articles[idx].image = req.body.image || "";
  articles[idx].content = req.body.content || "";
  articles[idx].excerpt = (req.body.content || "").slice(0, 120) + "...";
  articles[idx].coffeeInfo = req.body.coffeeInfo || "";
  saveJSON("articles.json", articles);
  res.redirect("/admin");
});

router.post("/admin/articles/:id/delete", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  let articles = req.app.locals.articles;
  articles = articles.filter((a) => a.id !== parseInt(req.params.id));
  saveJSON("articles.json", articles);
  req.app.locals.articles = articles;
  res.redirect("/admin");
});

router.post("/admin/orders/:id/status", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "admin") return res.redirect("/login");
  const orders = req.app.locals.orders;
  const order = orders.find((o) => o.id === req.params.id);
  if (order && req.body.status) {
    order.status = req.body.status;
    saveJSON("orders.json", orders);
  }
  res.redirect("/admin");
});

router.post("/mitarbeiter/orders/:id/status", (req, res) => {
  if (!res.locals.user || res.locals.user.role !== "employee") return res.redirect("/login");
  const orders = req.app.locals.orders;
  const order = orders.find((o) => o.id === req.params.id);
  if (order && req.body.status) {
    order.status = req.body.status;
    saveJSON("orders.json", orders);
  }
  res.redirect("/mitarbeiter");
});

router.get("/warenkorb", (req, res) => {
  res.render("layout", {
    title: "Warenkorb",
    body: "checkout",
    products: req.app.locals.products,
  });
});

router.get("/checkout", (req, res) => {
  res.redirect("/warenkorb");
});

router.post("/warenkorb", (req, res) => {
  const { vorname, nachname, adresse, lieferanschrift } = req.body;
  const products = req.app.locals.products;
  const cart = (() => { try { return JSON.parse(req.signedCookies.cart || "[]"); } catch { return []; } })();

  let subtotal = 0;
  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    return { name: product.name, quantity: item.quantity };
  }).filter(Boolean);

  const shipping = subtotal > 0 ? 4.90 : 0;
  const total = subtotal + shipping;

  const orders = req.app.locals.orders;
  const maxNum = orders.reduce((m, o) => {
    const n = parseInt(o.id.replace("ORD-", ""), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);

  const order = {
    id: "ORD-" + String(maxNum + 1).padStart(3, "0"),
    firstName: vorname,
    lastName: nachname,
    address: adresse,
    deliveryAddress: lieferanschrift || "",
    items,
    total: total.toFixed(2).replace(".", ",") + " €",
    status: "Neu",
  };

  orders.push(order);
  saveJSON("orders.json", orders);
  res.clearCookie("cart");
  res.render("layout", {
    title: "Bestellung eingegangen",
    body: "checkout",
    submitted: true,
    vorname,
    nachname,
  });
});

router.post("/checkout", (req, res) => {
  res.redirect(307, "/warenkorb");
});

module.exports = router;
