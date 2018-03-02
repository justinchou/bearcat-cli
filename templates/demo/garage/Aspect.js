/**
 * Created by bearcatjs-cli.
 * File: Aspect.js
 * User: justin
 * Date: 1/3/2018
 * Time: 21:51
 */

'use strict';

//const bearcat = require('bearcat');

let Aspect = function Aspect() {
    this.$id = 'aspect';
    // this.$scope  = 'prototype';
    // this.$parent = '';
    // this.$proxy  = false;
    this.$aop = true;

    this.count = 0;
};

Aspect.prototype.counter = function (next) {
    const $pointcut = "before:engine.run";
    // 小的先执行, 大的后执行
    let $order = 1;

    console.log('== before engine run count:', this.count);

    this.count += 1;
    next();
};

Aspect.prototype.check = function (target, method) {
    const $pointcut = "around:[bcmt].*?\.run";
    // 小的先执行, 大的后执行
    let $order = 1;

    console.log('~~ check before run');
    // 无回调的方法的调用, sync
    target[method]();
};

Aspect.prototype.statistics = function (err, next) {
    const $pointcut = "after:engine.run";
    // 小的先执行, 大的后执行
    let $order = 1;

    console.log('-- total counts: ', this.count);
    next();
};

bearcat.module(Aspect, typeof module !== 'undefined' ? module : {});
