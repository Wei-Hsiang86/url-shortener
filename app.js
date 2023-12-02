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

// 產生隨機碼
function randomID() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += characters[Math.floor(Math.random() * 62)];
  }

  // 判斷 id 是否重複
  if (urls.some((url) => url.id === id)) {
    return randomID();
  }

  // 無重複則輸出 id
  return id;
}
// console.log(randomID);

// 製造短網址
function shorten(inputUrl, data) {
  let urls = data;
  let id = "";
  // 如果輸入網址的最後一個字元為斜線，則將其去除
  if (inputUrl[inputUrl.length - 1] === "/") {
    inputUrl = inputUrl.slice(0, -1);
  }

  // 檢查網址是否已存在 urls.json，若有則回傳原先以建立之id
  if (urls.some((url) => url.orig === inputUrl)) {
    id = urls.find((url) => url.orig === inputUrl).id;
  } else {
    id = randomID();
    urls.push({
      id: id,
      orig: inputUrl,
    });

    // 將更新的資料寫入 urls.json
    fs.writeFile(urlsPath, JSON.stringify(urls), function (err) {
      if (err) {
        console.log("shorten url written failed");
        return console.error(err);
      }
      console.log("shorten url written successfully");
    });
  }

  return `http://localhost:3000/${id}`;
}