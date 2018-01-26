'use strict';

var tt = require('typescript-definition-tester');
var path = require('path');
var resolve = require('path').resolve;
var assert = require('chai').assert;
var request = require('request-promise');
var spawnTypeScript = require('./util/launch-utils').spawnTypeScript;

var GET = function(route) {
    return request({ url: 'http://localhost:12345' + route, resolveWithFullResponse: true }).then(function(res) {
        // Express sends 500 errors for uncaught exceptions (like failed assertions)
        // Make sure to still fail the test if an assertion in middleware failed.
        assert.equal(res.statusCode, 200);
        return res;
    });
};

describe('TypeScript', function() {
    it('should compile base-case successfully against index.d.ts', function(done) {
        this.timeout(20000);
        tt.compile([path.resolve(__dirname + '/typescript-resources/typescript-base-case.ts')], {}, done.bind(null));
    });

    it('should run the example and respond', function(done) {
        this.timeout(5000);
        var ts_file = resolve(__dirname, './test-resources/typescript-base-case.ts');
        var target = spawnTypeScript(ts_file);
        var called = false;

        target.stdout.on('data', function(data) {
            if (data.toString().indexOf('START') === -1) {
                return;
            }

            GET('/').then(function() {
                called = true;
                target.kill('SIGINT');
            });
        });

        target.stderr.on('data', function(data) {
            console.error(data.toString());
        });

        target.on('close', function() {
            assert(called);
            done();
        });
    });
});
