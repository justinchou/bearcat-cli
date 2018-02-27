'use strict';

let validate = require('validate-npm-package-name');
let Should = require('chai').should();

let pkg = require('../package');

describe('Package', () => {
    it('package name should be valid', function () {
        validate(pkg.name);
    });
});