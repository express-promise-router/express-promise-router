# express-promise-router

## 4.1.0

### Minor Changes

- c2f70e2: The handler function now uses the name of the original (wrapped) handler as its name to aid in debugging and tracing.

## 4.0.1

### Patch Changes

- 04a9dc3: Fix TypeScript dependencies for yarn v2 users, by including @types/express as an optional dependency.
  [#66](https://github.com/express-promise-router/express-promise-router/issues/66)
  [#96](https://github.com/express-promise-router/express-promise-router/pull/96)

## 4.0.0

### Breaking Changes

- Drop old (v4, v6, v8) node versions
  [#68](https://github.com/express-promise-router/express-promise-router/pull/68)

### Patch Changes

- 5739c6a: Fix incorrect array access check.

### Internal / Dev / Testing

- ecb1c51: Update deep transitive dependencies of eslint to remove vulnerable package "minimist".
- 1aff90b: Update dependency to remove transitive dependency on vulnerable package "minimist".
- b35e29d: Update babel to remove transitive dependency on vulnerable package "minimist".

## v3.0.3

- Improve package dependencies
  [#57](https://github.com/express-promise-router/express-promise-router/issues/57)

### v3.0.2

- Add `default` property to simulate es6 style default export
  [#50](https://github.com/express-promise-router/express-promise-router/issues/50)
  [#51](https://github.com/express-promise-router/express-promise-router/pull/51)

## v3.0.1

- Remove `@types/express` peerDependency
  [#47](https://github.com/express-promise-router/express-promise-router/pull/47)
  [#48](https://github.com/express-promise-router/express-promise-router/pull/48)

## v3.0.0

- Update to `chai` 4
- Update to `mocha` 4
- Update to `eslint` 4
- Update to `sinon` 4
- Reduced lodash usage and footprint [#41](https://github.com/express-promise-router/express-promise-router/issues/41)
- Added TypeScript definitions [#47](https://github.com/express-promise-router/express-promise-router/pull/47)

## v2.0.0

- Dropped support for old Node versions (<4).
  - Supported: Node 4 LTS, Node 6 LTS, Node current.
- Use native promises instead of bluebird. (One less dependency!)
- Use [`is-promise`](https://github.com/then/is-promise) module instead of our own function.

## v1.1.1

- Update to [`lodash`](https://lodash.com) 4
- Update to [`bluebird`](http://bluebirdjs.com/) 3

## v1.1.0

- Improvements to error reporting
- Support for route array
- Bug fixes
