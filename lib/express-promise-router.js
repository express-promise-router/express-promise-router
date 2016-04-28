var Router = require('express').Router;
var Promise = require('bluebird');
var _ = require('lodash');

var isPromise = function (obj) {
    // Just verify that this is a 'thennable' object
    return obj && 'object' === typeof(obj) && obj.then !== undefined;
};

var wrapHandler = function (handler) {
    if ('function' !== typeof handler) {
        var type = Object.prototype.toString.call(handler);
        var msg = 'Expected a callback function but got a ' + type;
        throw new Error(msg);
    }

    var handleReturn = function (args) {
        var promises = [];

        var next = args.slice(-1)[0];

        if ('string' === typeof next) {
            next = args.slice(-2)[0];
        }

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
            // Manipulating arguments directly is discouraged
            var args = new Array(arguments.length); 
            for(var i = 0; i < arguments.length; ++i) {
                args[i] = arguments[i];
            }

            // Grab the first parameter out in case it's a route or array of routes.
            var first = null;
            if ('string' === typeof args[0] || args[0] instanceof RegExp ||
                    (Array.isArray(args[0]) && 'string' === typeof args[0][0] || args[0][0] instanceof RegExp)) {
                first = args[0];
                args = args.slice(1);
            }

            args = _.flattenDeep(args).map(function (arg) {
                return wrapHandler(arg);
            });

            // If we have a route path or something, push it in front
            if (first) {
                args.unshift(first);
            }

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
