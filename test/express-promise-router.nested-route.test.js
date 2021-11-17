"use strict";

var assert = require("chai").assert;
var sinon = require("sinon");

var PromiseRouter = require("../lib/express-promise-router.js");

describe("Nested routes..", () => {
  it("Should correctly provide handle contexts when nested routes are created", () => {
    const router = PromiseRouter();
    const subRouter = PromiseRouter();

    subRouter.get("/users", (req, res) => res.send("ok"));
    router.use("/api", subRouter);

    assert.exists(router.stack[0].handle.stack);
  });
});
