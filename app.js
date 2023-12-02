const express = require("express");
const app = express();
const port = 3000;


//// 設定路由
app.get("/", (req, res) => {
  res.redirect("/movies");
});

app.get("/movies", (req, res) => {
  res.send("listing movies");
});

app.get("/movie/:id", (req, res) => {
  const id = req.params.id;
  res.send(`read movie: ${id}`);
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});

//// 功能
