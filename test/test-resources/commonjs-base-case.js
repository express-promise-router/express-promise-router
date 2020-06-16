var express = require("express");
var Router = require("../../lib/express-promise-router.js");
var router = Router();

router.get("/", function (req, res) {
  res.send("Hi!");
});

var app = express();
app.use(router);
app.listen(12345);
console.log("START");
