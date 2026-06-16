const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("coffeeart-demo-secret"));

function loadJSON(filename) {
  const filePath = path.join(__dirname, "data", filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

app.use((req, res, next) => {
  req.app.locals.products = loadJSON("products.json");
  req.app.locals.articles = loadJSON("articles.json");
  req.app.locals.users = loadJSON("users.json");

  const userId = req.signedCookies.userId;
  const user = req.app.locals.users.find((u) => u.id === parseInt(userId));
  res.locals.user = user || null;

  try {
    const cart = JSON.parse(req.signedCookies.cart || "[]");
    res.locals.cart = cart;
    res.locals.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    res.locals.cart = [];
    res.locals.cartCount = 0;
  }

  next();
});

const pagesRouter = require("./routes/pages");
const productsRouter = require("./routes/products");
const blogRouter = require("./routes/blog");
const apiRouter = require("./routes/api");
const cartRouter = require("./routes/cart");

app.use("/", pagesRouter);
app.use("/shop", productsRouter);
app.use("/blog", blogRouter);
app.use("/api", apiRouter);
app.use("/cart", cartRouter);

app.use((req, res) => {
  res.status(404).render("layout", {
    title: "Seite nicht gefunden",
    body: "<h1>404</h1><p>Seite nicht gefunden.</p>",
  });
});

app.listen(PORT, () => {
  console.log(`CoffeeArt Bremen läuft auf http://localhost:${PORT}`);
});
