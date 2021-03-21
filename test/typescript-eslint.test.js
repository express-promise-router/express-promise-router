"use strict";
const { ESLint } = require("eslint");
const assert = require("chai").assert;
const eslintConfig = require("./test-resources/.eslintrc.typescript-test.json")

describe("TypeScript ESLint", function () {
  it("should lint the base case without errors or warnings", async function () {
    const eslint = new ESLint({
      overrideConfig: eslintConfig,
    });
    const results = await eslint.lintFiles([
      "test/test-resources/typescript-base-case.ts",
    ]);

    if (results[0].messages.length !== 0) {
      console.log(results[0].messages)
    }

    assert.isEmpty(results[0].messages, "Linting error or warning generated")
  });
});
