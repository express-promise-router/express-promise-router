"use strict";

var assert = require("chai").assert;
var list = require("express-list-endpoints");

var PromiseRouter = require("../lib/express-promise-router.js");

describe("nested routes", () => {
  it("should provide handle contexts when nested routes are created", () => {
    const router = PromiseRouter();
    const subRouter = PromiseRouter();

    subRouter.get("/users", (req, res) => res.send("ok"));
    router.use("/api", subRouter);

    assert.exists(router.stack[0].handle.stack);
  });

  it("should list routes with express-list-endpoints", () => {
    const router = PromiseRouter();
    const subRouter = PromiseRouter();

    subRouter.get("/users", (req, res) => res.send("ok"));
    router.use("/api", subRouter);

    assert.deepEqual(list(router), [
      {
        path: "/api/users",
        methods: ["GET"],
        middlewares: ["anonymous"],
      },
    ]);
  });
});
