var request = require('request-promise');
var assert = require('chai').assert;

exports.GET = function(route) {
    return request({ url: 'http://localhost:12345' + route, resolveWithFullResponse: true }).then(function(res) {
        // Express sends 500 errors for uncaught exceptions (like failed assertions)
        // Make sure to still fail the test if an assertion in middleware failed.
        assert.equal(res.statusCode, 200);
        return res;
    });
};
