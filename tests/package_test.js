/**
 * Created by bearcat-cli.
 * File: package_test.js
 * User: justin
 * Date: 27/2/2018
 * Time: 02:17
 */

'use strict';

let validate = require('validate-npm-package-name');
let Should = require('chai').should();

let pkg = require('../package');

describe('Package', () => {
    it('package name should be valid', function () {
        validate(pkg.name);
    });
});