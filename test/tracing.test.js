const Router = require("../lib/express-promise-router");
const assert = require("chai").assert;

describe("function name", function () {
  it("uses the wrapped handler's name in a route handler", function () {
    const router = Router();
    router.get("/test-route", function actualHandler() {});

    assert.equal(router.stack[0].route.stack[0].handle.name, "actualHandler");
    assert.equal(router.stack[0].route.stack[0].name, "actualHandler");
  });

  it("uses the wrapped handler's name in a middleware handler", function () {
    const router = Router();
    router.use(function actualHandler(req, res, next) {});

    assert.equal(router.stack[0].handle.name, "actualHandler");
    assert.equal(router.stack[0].name, "actualHandler");
  });

  it("uses the wrapped handler's name in an error middleware", function () {
    const router = Router();
    router.use(function actualErrorHandler(err, req, res, next) {});

    assert.equal(router.stack[0].handle.name, "actualErrorHandler");
    assert.equal(router.stack[0].name, "actualErrorHandler");
  });

  it("empty name for anonymous middleware handler", function () {
    const router = Router();
    router.use((req, res, next) => {});

    assert.equal(router.stack[0].handle.name, "");
    assert.equal(router.stack[0].name, "<anonymous>");
  });
});
