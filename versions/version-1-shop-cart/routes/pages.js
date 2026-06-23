const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const products = req.app.locals.products;
  const articles = req.app.locals.articles;
  res.render("layout", {
    title: "CoffeeArt Bremen",
    body: "index",
    featuredProducts: products.slice(0, 4),
    featuredArticles: articles.slice(0, 2),
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

  let recommendation = products[0];

  if (strength === "stark" || type === "Espresso") {
    const strong = products.filter(
      (p) => p.kaffeesorte === "Espresso" && p.strength >= 4
    );
    if (strong.length) recommendation = strong[0];
  } else if (taste === "Fruchtig" || taste === "Blumig") {
    const fruity = products.filter((p) => p.taste === taste);
    if (fruity.length) recommendation = fruity[0];
  } else if (strength === "mild" || type === "Filterkaffee") {
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
    const redirect = user.role === "Kunde" ? "/shop" : "/admin";
    return res.redirect(redirect);
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

  res.render("layout", {
    title: "Admin Dashboard",
    body: "admin",
    products: req.app.locals.products,
    articles: req.app.locals.articles,
  });
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
