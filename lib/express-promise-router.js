"use strict";
const Router = require("express").Router;
const flattenDeep = require("lodash.flattendeep");
const isPromise = require("is-promise");

const wrapHandler = function (handler) {
  if ("function" !== typeof handler) {
    const type = Object.prototype.toString.call(handler);
    const msg = "Expected a callback function but got a " + type;
    throw new Error(msg);
  }

  const handleReturn = function (args) {
    // Find the next function from the arguments
    let next = args.slice(-1)[0];

    // When calling router.param, the last parameter is a string, not next.
    // If so, the next should be the one before it.
    if ("string" === typeof next) {
      next = args.slice(-2)[0];
    }

    // Call the route
    const ret = handler.apply(null, args);

    // If it doesn't return a promise, we exit.
    if (!isPromise(ret)) {
      return;
    }

    // Since we got a promise, we handle calling next
    Promise.resolve(ret).then(
      function (d) {
        if (d === "next") {
          next();
        } else if (d === "route") {
          next("route");
        }
      },
      function (err) {
        if (!err) {
          err = new Error(
            "returned promise was rejected but did not have a reason",
          );
        }
        next(err);
      },
    );
  };

  if (handler.length === 4) {
    // Preserve the original handler function name. See #146.
    const wrapperObj = {
      [handler.name]: function (err, req, res, next) {
        handleReturn([err, req, res, next]);
      },
    };
    Object.assign(wrapperObj[handler.name], handler);
    return wrapperObj[handler.name];
  }

  // Preserve the original handler function name. See #146.
  const wrapperObj = {
    [handler.name]: function (req, res, next) {
      handleReturn([req, res, next]);
    },
  };

  // Correctly include router handler context. See #306.
  Object.assign(wrapperObj[handler.name], handler);

  return wrapperObj[handler.name];
};

const wrapMethods = function (instanceToWrap, isRoute) {
  const toConcat = isRoute ? ["all"] : ["use", "all", "param"];

  const methods = require("methods").concat(toConcat);

  methods.forEach(function (method) {
    const original = "__" + method;
    instanceToWrap[original] = instanceToWrap[method];
    instanceToWrap[method] = function () {
      // Manipulating arguments directly is discouraged
      let args = new Array(arguments.length);
      for (let i = 0; i < arguments.length; ++i) {
        args[i] = arguments[i];
      }

      // Grab the first parameter out in case it's a route or array of routes.
      let first = null;
      if (
        "string" === typeof args[0] ||
        args[0] instanceof RegExp ||
        (Array.isArray(args[0]) &&
          ("string" === typeof args[0][0] || args[0][0] instanceof RegExp))
      ) {
        first = args[0];
        args = args.slice(1);
      }

      args = flattenDeep(args).map(function (arg) {
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

const PromiseRouter = function (path) {
  const me = wrapMethods(new Router(path));

  me.__route = me.route;
  me.route = function (path) {
    return wrapMethods(me.__route(path), true);
  };
  Object.assign(me.route, me.__route);

  return me;
};

PromiseRouter.default = PromiseRouter;
module.exports = PromiseRouter;
