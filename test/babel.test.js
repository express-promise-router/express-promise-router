"use strict";

var resolve = require("path").resolve;
var assert = require("chai").assert;
var spawnBabel = require("./util/launch-utils").spawnBabel;
var GET = require("./util/http-utils").GET;

describe("Babel", function () {
  it("should run the example and respond", function (done) {
    this.timeout(5000);
    var js_file = resolve(__dirname, "./test-resources/babel-base-case.js");
    var target = spawnBabel(js_file);
    var called = false;

    target.stdout.on("data", function (data) {
      if (data.toString().indexOf("START") === -1) {
        return;
      }

      GET("/").then(function () {
        called = true;
        target.kill("SIGINT");
      });
    });

    target.stderr.on("data", function (data) {
      console.error(data.toString());
    });

    target.on("close", function () {
      assert(called);
      done();
    });
  });
});
