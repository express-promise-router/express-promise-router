var Router = require('express').Router;
var Promise = require('bluebird');
var _ = require('lodash');

var isPromise = function (obj) {
    // Just verify that this is a 'thennable' object
    return obj && 'object' === typeof(obj) && obj.then !== undefined;
};

var wrapHandler = function (handler) {

    var handleReturn = function (args) {
        var wrappedNext;
        var nextPromise = new Promise(function (resolve, reject) {
            wrappedNext = function (err) {
                if (err && err !== 'route') {
                    reject(err);
                } else {
                    resolve(err || 'next');
                }
            };
        });

        var promises = [nextPromise];

        var next = args.slice(-1)[0];
        var ret = handler.apply(null, args);

        if (isPromise(ret)) {
            promises.push(ret);
        }

        Promise.race(promises)
            .then(function (d) {
                if (d === 'next') {
                    next();
                } else if (d === 'route') {
                    next('route');
                }
            }, function (err) {
                if (!err) {
                    err = new Error('returned promise was rejected but did not have a reason');
                }
                next(err);
            }).done();
    };

    if (handler.length === 4) {
        return function (err, req, res, next) {
            handleReturn([err, req, res, next]);
        };
    }

    return function (req, res, next) {
        handleReturn([req, res, next]);
    };
};

var wrapMethods = function (instanceToWrap, isRoute)
{
    var toConcat = isRoute ? ['all'] : ['use','all','param'];
    
    var methods = require('methods').concat(toConcat);

    _.each(methods, function (method) {
        var original = '__' + method;
        instanceToWrap[original] = instanceToWrap[method];
        instanceToWrap[method] = function () {
            var args = _.flattenDeep(arguments).map(function (arg, idx) {
                if (idx === 0 && ('string' === typeof arg || arg instanceof RegExp)) {
                    return arg;
                }
                return wrapHandler(arg);
            });

            return instanceToWrap[original].apply(this, args);
        };
    });

    return instanceToWrap;
};

var PromiseRouter = function (path)
{
    var me = wrapMethods(new Router(path));

    me.__route = me.route;
    me.route = function(path)
    {
        return wrapMethods(me.__route(path), true);
    };

    return me;
};

module.exports = PromiseRouter;
