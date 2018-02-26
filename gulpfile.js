/**
 * Created by bearcat-cli.
 * File: gulpfile.js
 * User: justin
 * Date: 27/2/2018
 * Time: 02:21
 */

'use strict';

const Gulp = require('gulp');
const Mocha = require('gulp-mocha');
const Through = require('through2');

Gulp.task('default', function () {
    return Gulp.src('tests/**/*_test.js', {read: false})
        .pipe(Mocha({
            reporter: 'spec',
            checkLeaks: true,
            bail: true,

            globals: {
                should: require('chai').should()
            }
        }));
});

Gulp.task("ci", function () {
    return Gulp.src('tests/**/*_test.js', {read: false})
        .pipe(Mocha({
            reporter: 'xunit',
            reporterOptions: {output: "xunit.xml", suiteName: "Bearcat Cli"},
            checkLeaks: true,

            globals: {
                should: require('chai').should()
            }
        }));
});