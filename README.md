# express-promise-router

[![npm version](https://badge.fury.io/js/express-promise-router.svg)](https://badge.fury.io/js/express-promise-router)
[![Build Status](https://travis-ci.org/express-promise-router/express-promise-router.svg?branch=master)](https://travis-ci.org/express-promise-router/express-promise-router)

A simple wrapper for Express 4's Router that allows middleware to return promises.
This package makes it simpler to write route handlers for Express when dealing
with promises by reducing duplicate code.

## Getting Started

Install the module with npm

```bash
npm install express-promise-router --save
```

or yarn.

```bash
yarn add express-promise-router
```

`express-promise-router` is a drop-in replacement for Express 4's `Router`.

## Documentation

Middleware and route handlers can simply return a promise.
If the promise is rejected, `express-promise-router` will call `next` with the
reason. This functionality removes the need to explicitly define a rejection
handler.

```javascript
// With Express 4's router
var router = require("express").Router();

router.use("/url", function(req, res, next) {
    Promise.reject().catch(next);
});

// With express-promise-router
var router = require("express-promise-router")();

router.use("/url", function(req, res) {
    return Promise.reject();
});
```

Calling `next()` and `next("route")` is supported by resolving a promise with either `"next"` or `"route"`. No action is taken if the promise is resolved with any other value.

```javascript
router.use("/url", function(req, res) {
    // equivalent to calling next()
    return Promise.resolve("next");
});

router.use("/url", function(req, res) {
    // equivalent to calling next('route')
    return Promise.resolve("route");
});
```

This package still allows calling `next` directly.

```javascript
router = require("express-promise-router")();

// still works as expected
router.use("/url", function(req, res, next) {
    next();
});
```

### ES6 Imports

`express-promise-router` can be imported via ES6 imports. The `Router`
constructor is the default export.

```javascript
import Router from "express-promise-router";
const router = Router();
```

### Async / Await

Using `async` / `await` can dramatically improve code readability.

```javascript
router.get('/url', async (req, res) {
    const user = await User.fetch(req.user.id);

    if (user.permission !== "ADMIN") {
      throw new Error("You must be an admin to view this page.");
    }

    res.send(`Hi ${user.name}!`);
})
```

### Error handling

Just like with regular `express.Router` you can define custom error handlers.

```javascript
router.use((err, req, res, next) => {
    res.status(403).send(err.message);
});
```

### Frequently Asked Questions

#### `Cannot read property '0' of undefined`

This error may indicate that you call a method that needs a path, without one.
Calling `router.get` (or `post`, `all` or any other verb) without a path is not
valid. You should always specify a path like this:

```javascript
// DO:
router.get("/", function(req, res) {
    res.send("Test");
});

// DON'T:
router.get(function(req, res) {
    res.send("Test");
});
```

For more information take a look at [this comment](https://github.com/express-promise-router/express-promise-router/issues/46#issuecomment-342002277).

#### Can i use this on `app`?

We currently don't support promisifying the `app` object. To use promises with
the top-level router we recommend mounting a `Router` on the app object, like
this:

```javascript
import express from "express";
import Router from "express-promise-router";

const app = express();
const router = Router();
app.use(router);

router.get("/", function(req, res) {
    res.send("Test");
});
```

#### Why aren't promise values sent to the client

We don't send values at the end of the promise chain to the client, because this
could easily lead to the unintended leak of secrets or internal state. If you
intend to send the result of your chain as JSON, please add an explicit
`.then(data => res.send(data))` to the end of your chain or send it in the last
promise handler.

## Contributing

Add unit tests for any new or changed functionality.
Lint and test your code using `npm test`.

Unit tests use [mocha](https://mochajs.org) and
[chai](http://chaijs.com).

We use [eslint](http://eslint.org), but styling is
controlled mostly by
[prettier](https://github.com/prettier/prettier/blob/master/README.md)
which reformats your code before you commit. You can manually trigger a
reformat using `npm run-script format`.

## Release History

### v3.0.3

-   Improve package dependencies
    [#57](https://github.com/express-promise-router/express-promise-router/issues/57)

### v3.0.2

-   Add `default` property to simulate es6 style default export
    [#50](https://github.com/express-promise-router/express-promise-router/issues/50)
    [#51](https://github.com/express-promise-router/express-promise-router/pull/51)

### v3.0.1

-   Remove `@types/express` peerDependency
    [#47](https://github.com/express-promise-router/express-promise-router/pull/47)
    [#48](https://github.com/express-promise-router/express-promise-router/pull/48)

### v3.0.0

-   Update to `chai` 4
-   Update to `mocha` 4
-   Update to `eslint` 4
-   Update to `sinon` 4
-   Reduced lodash usage and footprint [#41](https://github.com/express-promise-router/express-promise-router/issues/41)
-   Added TypeScript definitions [#47](https://github.com/express-promise-router/express-promise-router/pull/47)

### v2.0.0

-   Dropped support for old Node versions (<4).
    -   Supported: Node 4 LTS, Node 6 LTS, Node current.
-   Use native promises instead of bluebird. (One less dependency!)
-   Use [`is-promise`](https://github.com/then/is-promise) module instead of our own function.

### v1.1.1

-   Update to [`lodash`](https://lodash.com) 4
-   Update to [`bluebird`](http://bluebirdjs.com/) 3

### v1.1.0

-   Improvements to error reporting
-   Support for route array
-   Bug fixes

## Attribution

Licensed under the [MIT license](LICENSE).

Initial implementation by [Alex Whitney](https://github.com/alex-whitney) \
Maintained by [Moritz Mahringer](https://github.com/mormahr) \
Contributed to by [awesome people](https://github.com/express-promise-router/express-promise-router/graphs/contributors)
