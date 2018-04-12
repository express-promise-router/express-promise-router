# express-promise-router

[![npm version](https://badge.fury.io/js/express-promise-router.svg)](https://badge.fury.io/js/express-promise-router)
[![Build Status](https://travis-ci.org/mormahr/express-promise-router.svg?branch=master)](https://travis-ci.org/mormahr/express-promise-router)

A simple wrapper for Express 4's Router that allows middleware to return promises. This package makes it simpler to
write route handlers for Express when dealing with promises by reducing duplicate code.

## Getting Started
Install the module with: `npm install express-promise-router --save`.

`express-promise-router` is a drop-in replacement for Express 4's Router.


## Documentation

Middleware and route handlers can simply return a promise. If the promise is rejected, ```express-promise-router``` will
call ```next``` with the reason. This functionality removes the need to explicitly define a rejection handler.
```javascript
// With Express 4's router
var router = require('express').Router();

router.use('/url', function (req, res, next) {
    Promise.reject().catch(next);
})

// With express-promise-router
var router = require('express-promise-router')();

router.use('/url', function (req, res) {
    return Promise.reject();
})
```

Calling ```next()``` and ```next('route')``` is supported by resolving a promise with either ```'next'``` or
```'route'```. No action is taken if the promise is resolved with any other value.
```javascript
router.use('/url', function (req, res) {
    // equivalent to calling next()
    return Promise.resolve('next');
});

router.use('/url', function (req, res) {
    // equivalent to calling next('route')
    return Promise.resolve('route');
});
```

This package still allows calling ```next``` directly.
```javascript
router = require('express-promise-router')();

// still works as expected
router.use('/url', function (req, res, next) {
    next();
});
```


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
### v3.0.2
* Add `default` property to simulate es6 style default export
    [#50](https://github.com/express-promise-router/express-promise-router/issues/50)
    [#51](https://github.com/express-promise-router/express-promise-router/pull/51)
### v3.0.1
* Remove `@types/express` peerDependency
    [#47](https://github.com/express-promise-router/express-promise-router/pull/47)
    [#48](https://github.com/express-promise-router/express-promise-router/pull/48)
### v3.0.0
* Update to `chai` 4
* Update to `mocha` 4
* Update to `eslint` 4
* Update to `sinon` 4 
* Reduced lodash usage and footprint [#41](https://github.com/express-promise-router/express-promise-router/issues/41)
* Added TypeScript definitions [#47](https://github.com/express-promise-router/express-promise-router/pull/47)
### v2.0.0
* Dropped support for old Node versions (<4).
  * Supported: Node 4 LTS, Node 6 LTS, Node current.
* Use native promises instead of bluebird. (One less dependency!)
* Use [`is-promise`](https://github.com/then/is-promise) module instead of our own function.
### v1.1.1
* Update to [`lodash`](https://lodash.com) 4
* Update to [`bluebird`](http://bluebirdjs.com/) 3
### v1.1.0
* Improvements to error reporting
* Support for route array
* Bug fixes

## License
Copyright (c) 2014 Alex Whitney. Licensed under the MIT license.
