/**
 * Created by bearcatjs-lession-one.
 * File: CanProduceAop.js
 * User: justin
 * Date: 2/3/2018
 * Time: 11:05
 */

'use strict';


//const bearcat = require('bearcat');

let CanProduceAop = function CanProduceAop() {
    this.$id = 'canProduceAop';
    // this.$scope  = 'prototype';
    // this.$parent = '';
    // this.$proxy  = false;
    this.$aop = true;
};

CanProduceAop.prototype.prepare = function (next) {
    console.log(arguments);
    let $pointcut = "before:producer.produceCan";
    let $order = 10;
    let $runtime = false;

    console.log('----- Aop can prepare');
    next();
};

CanProduceAop.prototype.produceStartLog = function (type, next) {
    console.log(arguments);
    let $pointcut = "before:producer.produceCan";
    let $order = 21;
    let $runtime = true;

    console.log('----- Aop %s can ready to produce', type);
    next();
};

CanProduceAop.prototype.produceReady2 = function (target, method, next) {
    console.log(arguments);
    let $pointcut = "around:producer.produceCan";
    let $order = 1;
    let $runtime = false;

    console.log('{{{{{ Aop can produce ready');
    target[method]('apple', function (err, data) {
        console.log('}}}}} Aop can produce finish');

        next(err, data);
    });
};

CanProduceAop.prototype.produceReady1 = function (target, method, type, next) {
    console.log(arguments);
    let $pointcut = "around:producer.produceCan";
    let $order = 1;
    let $runtime = true;

    console.log('((((( Aop can produce ready');
    target[method](type, function (err, data) {
        console.log('))))) Aop can produce finish');

        next(err, data);
    });
};

CanProduceAop.prototype.sell = function (err, product, next) {
    console.log(arguments);
    let $pointcut = "after:producer.produceCan";
    let $order = 10;
    // let $runtime = true;

    console.log('~~~~~ Aop can produce finish [ %j ] err:', product, err);
    next();
};

bearcat.module(CanProduceAop, typeof module !== 'undefined' ? module : {});
