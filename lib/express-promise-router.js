var Router = require('express').Router;
var Promise = require('bluebird');
var _ = require('lodash');

var isPromise = function (obj) {
    // Just verify that this is a 'thennable' object
    return obj && 'object' === typeof(obj) && obj.then !== undefined;
};

var wrapHandler = function (handler) {
    var defer = Promise.defer();

    var wrappedNext = function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    };

    var handleReturn = function (ret, next) {
        if (isPromise(ret)) {
            defer.resolve();
            ret.then(function (d) {
                if (d === 'next') {
                    next();
                } else if (d === 'route') {
                    next('route');
                } else {
                    next(d);
                }
            }, next).done();
        } else {
            defer.promise.then(next, next).done();
        }
    };

    if (handler.length === 4) {
        // Error handler
        return function (err, req, res, next) {
            handleReturn(handler(err, req, res, wrappedNext), next);
        };
    }

    // Normal handler
    return function (req, res, next) {
        handleReturn(handler(req, res, wrappedNext), next);
    };
};

var PromiseRouter = function (path) {
    var me = new Router(path);

    var methods = require('methods').concat([
        'use',
        'all'
    ]);

    _.each(methods, function (method) {
        var original = '__' + method;
        me[original] = me[method];
        me[method] = function () {
            var args = _.map(arguments, function (arg, idx) {
                if (idx === 0 && 'string' === typeof arg) {
                    return arg;
                }
                return wrapHandler(arg);
            });

            return me[original].apply(this, args);
        };
    });

    return me;
};

module.exports = PromiseRouter;