'use strict';

let Engine = function Engine() {
    this.$id = 'engine';
    this.$scope = 'prototype';
};

function nooooop() {

}

Engine.prototype.run = function (next) {
    console.log('engine run...');
    next ? next() : nooooop();
};

bearcat.module(Engine, typeof module !== 'undefined' ? module : {});
