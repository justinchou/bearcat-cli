/**
 * Created by bearcatjs-lession-one.
 * File: Aspection.js
 * User: justin
 * Date: 2/3/2018
 * Time: 10:26
 */

'use strict';


//const bearcat = require('bearcatjs');

let Aspection = function Aspection() {
    this.$id = 'aspection';
    // this.$scope  = 'prototype';
    // this.$parent = '';
    // this.$proxy  = false;
    this.$aop = true;
};

Aspection.prototype.aspectBefore1 = function (next) {
    console.log(arguments);
    let $pointcut = "before:.*?produce.*?";
    let $order = 1;

    console.log('======== Start');
    next();
};

Aspection.prototype.aspectBefore2 = function () {
    console.log(arguments);
    let $pointcut = "before:.*?produce.*?";
    let $order = 2;
    let $runtime = true;

    let args = Array.prototype.slice.apply(arguments);
    let next = args.pop();

    console.log('======== Start args %j ', args);
    next();
};

Aspection.prototype.aspectAfter = function () {
    console.log(arguments);
    let $pointcut = "after:.*?produce.*?";
    let $order = 1000;

    let args = Array.prototype.slice.apply(arguments);
    let next = args.pop();

    console.log('======== End return %j ', args);
    console.log();
    next();
};

bearcat.module(Aspection, typeof module !== 'undefined' ? module : {});
