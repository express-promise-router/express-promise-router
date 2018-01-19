'use strict';

var tt = require('typescript-definition-tester');
var path = require('path');

describe('TypeScript', function() {
    it('should compile base-case successfully against index.d.ts', function(done) {
        this.timeout(20000);
        tt.compile([path.resolve(__dirname + '/typescript-resources/base-case.ts')], {}, done.bind(null));
    });
});
