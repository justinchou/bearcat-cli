'use strict';

const Bearcat = require('bearcat');

let Engine = function Engine() {
    this.$id = "engine";
    this.$scope = 'prototype';
};

Engine.prototype.run = function () {
    console.log('engine run...');
};

Bearcat.module(Engine, typeof module !== 'undefined' ? module : {});
