'use strict';

const Gulp = require('gulp');
const Mocha = require('gulp-mocha');
const Eslint = require('gulp-eslint');
const Through = require('through2');
const EslintConfig = require('./.eslintrc');

Gulp.task('default', ['lint'], function () {
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

Gulp.task('ci', function () {
    return Gulp.src('tests/**/*_test.js', {read: false})
        .pipe(Mocha({
            reporter: 'xunit',
            reporterOptions: {output: 'xunit.xml', suiteName: 'Bearcat Cli'},
            checkLeaks: true,

            globals: {
                should: require('chai').should()
            }
        }));
});

Gulp.task('lint', function () {
    return Gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(Eslint(EslintConfig))
        .pipe(Eslint.format())
        .pipe(Eslint.failAfterError());
    // .pipe(Eslint.formatEach('compact', process.stderr));
});
