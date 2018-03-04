/**
 * Created by bearcatjs-lession-one.
 * File: Producer.js
 * User: justin
 * Date: 2/3/2018
 * Time: 10:10
 */

'use strict';

let Producer = function Producer() {
    this.$id = 'producer';
    // this.$scope  = 'prototype';
    // this.$parent = '';
    // this.$proxy  = false;
};

Producer.prototype.produceCan = function (type, next) {
    let names = {
        "fish": "沙丁鱼罐头",
        "apple": "苹果罐头",
        "meat": "午餐肉罐头"
    };

    console.log('Callee produceCan');

    next && next(null, {
        name: names[type] || "定制罐头",
        type: type
    });
};

Producer.prototype.produceCar = function () {

};

bearcat.module(Producer, typeof module !== 'undefined' ? module : {});
