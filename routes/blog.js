const express = require("express");
const router = express.Router();

function categorySlug(category) {
  return String(category || "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

router.get("/", (req, res) => {
  const articles = req.app.locals.articles;
  const selectedCategory = req.query.category || "";
  const categories = [...new Set(articles.map((article) => article.category).filter(Boolean))]
    .map((category) => ({
      label: category,
      slug: categorySlug(category),
    }));
  const filteredArticles = selectedCategory
    ? articles.filter((article) => categorySlug(article.category) === selectedCategory)
    : articles;

  res.render("layout", {
    title: "Blog",
    body: "blog",
    articles: filteredArticles,
    categories,
    selectedCategory,
  });
});

router.get("/:id", (req, res) => {
  const articles = req.app.locals.articles;
  const article = articles.find((a) => a.id === parseInt(req.params.id));

  if (!article) {
    return res.status(404).render("layout", {
      title: "Artikel nicht gefunden",
      body: "<h1>404</h1><p>Artikel nicht gefunden.</p>",
    });
  }

  res.render("layout", {
    title: article.title,
    body: "article-detail",
    article,
  });
});

module.exports = router;
