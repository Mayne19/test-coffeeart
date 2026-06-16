const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("layout", {
    title: "Blog",
    body: "blog",
    articles: req.app.locals.articles,
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
