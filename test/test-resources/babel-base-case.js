import express from "express";
import Router from "../../lib/express-promise-router.js";
const router = Router();

router.get("/", function (req, res) {
  res.send("Hi!");
});

const app = express();
app.use(router);
app.listen(12345);
console.log("START");
