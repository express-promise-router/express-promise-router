"use strict";

var tt = require("@mormahr/typescript-definition-tester");
var path = require("path");
var resolve = require("path").resolve;
var assert = require("chai").assert;
var spawnTypeScript = require("./util/launch-utils").spawnTypeScript;
var GET = require("./util/http-utils").GET;
var compilerOptions = require("./test-resources/tsconfig.json").compilerOptions
var typescript = require("typescript")

// TypeScript uses number based enums instead of strings for the JS API
compilerOptions.moduleResolution = typescript.ModuleResolutionKind.NodeJs

describe("TypeScript", function () {
  it("should compile base-case successfully against index.d.ts", function (done) {
    this.timeout(20000);
    tt.compile(
      [path.resolve(__dirname + "/test-resources/typescript-base-case.ts")],
      compilerOptions,
      done.bind(null),
    );
  });

  it("should run the example and respond", function (done) {
    this.timeout(5000);
    var ts_file = resolve(
      __dirname,
      "./test-resources/typescript-base-case.ts",
    );
    var target = spawnTypeScript(ts_file, compilerOptions);
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
