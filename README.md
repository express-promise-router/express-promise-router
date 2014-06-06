# express-promise-router

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
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Alex Whitney. Licensed under the MIT license.
