'use strict';

var assert = require('chai').assert;
var Promise = require('bluebird');
var sinon = require('sinon');
var express = require('express');
var request = Promise.promisify(require('request'));

var PromiseRouter = require('../lib/express-promise-router.js');

describe('express-promise-router', function () {
    var app;
    var serverListening;
    var server;
    var router;

    var GET = function (route) {
        return request('http://localhost:12345' + route).spread(function (res) {
            // Express sends 500 errors for uncaught exceptions (like failed assertions)
            // Make sure to still fail the test if an assertion in middleware failed.
            assert.equal(res.statusCode, 200);
        });
    };

    var bootstrap = function (router) {
        app = express();
        app.use('/', router);

        if (serverListening) { throw 'already bootstrapped'; }

        serverListening = new Promise(function (resolve, reject) {
            server = app.listen(12345, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return serverListening;
    };

    beforeEach(function () {
        router = new PromiseRouter();
    });

    afterEach(function (done) {
        if (serverListening)
        {
            serverListening.then(function () {
                server.close();
                app = undefined;
                server = undefined;
                serverListening = undefined;
            }).then(done, done);
        } else {
            done();
        }
    });

    it('should call next with an error when a returned promise is rejected', function (done) {
        var callback = sinon.spy();

        router.use('/foo', function () {
            return new Promise(function (resolve, reject) {
                setTimeout(reject('some error'), 10);
            });
        });
        router.use(function (err, req, res, next) {
            assert.equal('some error', err);
            callback();
            res.send();
        });

        bootstrap(router).then(function () {
            return GET('/foo');
        }).then(function () {
            assert(callback.calledOnce);
        }).then(done, done);
    });

    it('should call next without an error when a returned promise is resolved with "next"', function (done) {
        var errorCallback = sinon.spy();
        var nextCallback = sinon.spy();

        router.use('/foo', function () {
            return new Promise(function (resolve) {
                setTimeout(resolve('next'), 10);
            });
        });
        router.use('/foo', function (req, res) {
            nextCallback();
            res.send();
        });
        router.use(function (err, req, res, next) {
            errorCallback();
            next();
        });

        bootstrap(router).then(function () {
            return GET('/foo');
        }).then(function () {
            assert(errorCallback.notCalled);
            assert(nextCallback.calledOnce);
        }).then(done, done);
    });

    it('should call next with an error when a returned promise is resolved with anything', function (done) {
        var callback = sinon.spy();

        router.use('/foo', function () {
            return new Promise(function (resolve) {
                setTimeout(resolve('something'), 10);
            });
        });
        router.use(function (err, req, res, next) {
            assert.equal('something', err);
            callback();
            res.send();
        });

        bootstrap(router).then(function () {
            return GET('/foo');
        }).then(function () {
            assert(callback.calledOnce);
        }).then(done, done);
    });

    it('should move to the next middleware when next is called without an error', function (done) {
        var callback = sinon.spy();

        router.use('/foo', function (req, res, next) {
            next();
        });
        router.use('/foo', function (req, res, next) {
            callback();
            res.send();
        });

        bootstrap(router).then(function () {
            return GET('/foo');
        }).then(function () {
            assert(callback.calledOnce);
        }).then(done, done);
    });

    it('should move to the next error handler when next is called with an error', function (done) {
        var callback = sinon.spy();
        var errorCallback = sinon.spy();

        router.use('/foo', function (req, res, next) {
            next('an error');
        });
        router.use('/foo', function (req, res, next) {
            callback();
            next();
        });
        router.use(function (err, req, res, next) {
            assert.equal('an error', err);
            errorCallback();
            res.send();
        });

        bootstrap(router).then(function () {
            return GET('/foo');
        }).then(function () {
            assert(errorCallback.calledOnce);
            assert(callback.notCalled);
        }).then(done, done);
    });

    it('should call chained handlers in the correct order', function (done) {
        var fn1 = sinon.spy(function () {
            assert(fn2.notCalled);
            return Promise.resolve();
        });
        var fn2 = sinon.spy(function (req, res) {
            res.send();
        });

        router.get('/foo', fn1, fn2);

        bootstrap(router).then(function () {
            return GET('/foo');
        }).then(done, done);
    });

    it('should call next("route") if a returned promise is resolved with "route"', function (done) {
        var fn1 = function () {
            return Promise.resolve('route');
        };
        var fn2 = function () {
            assert.fail();
        };

        router.get('/foo', fn1, fn2);
        router.get('/foo', function (req, res) {
            res.send();
        });

        bootstrap(router).then(function () {
            return GET('/foo');
        }).then(done, done);
    });


    it('should bind to RegExp routes', function (done) {
        var fn1 = function (req, res) {
            res.send();
        };

        router.get(/^\/foo/, fn1);

        bootstrap(router).then(function () {
            return GET('/foo');
        }).then(done, done);
    });

});
