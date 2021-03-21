import Router from "../../lib/express-promise-router.js";
import express from "express";

const router = Router();

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.get("/", async function (_req, res) {
  await wait(10);
  res.send("Hi!");
});

const app = express();
app.use(router);
app.listen(12345);
console.log("START");
