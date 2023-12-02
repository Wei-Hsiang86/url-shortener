const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

const urls = require("./public/jsons/urls.json") || [];
const urlsPath = "./public/jsons/urls.json";
const fs = require("fs");

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
// 使用 static files
app.use(express.static("public"));

// 設定路由
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/shorten", (req, res) => {
  const inputUrl = req.query.url;
  if (inputUrl && inputUrl.length > 0) {
    const shortUrl = shorten(inputUrl, urls);
    res.render("shorten", { shortUrl });
  }
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  const url = urls.find((data) => data.id === id);

  // 如果找不到對應id則導回首頁
  if (!url) {
    res.redirect("/");
  }

  res.redirect(url.orig);
});

// 設定執行伺服器時， CLI 要執行的動作
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
