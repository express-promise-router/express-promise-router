const assert = require("chai").assert;
const fetch = require("./fetch.cjs");

exports.GET = async function (route) {
  const response = await fetch("http://localhost:12345" + route)

  // Express sends 500 errors for uncaught exceptions (like failed assertions)
  // Make sure to still fail the test if an assertion in middleware failed.
  assert.equal(response.status, 200);

  return response;
};
