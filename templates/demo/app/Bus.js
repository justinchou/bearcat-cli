'use strict';

const Bearcat = require('bearcat');

let Bus = function Bus() {
    this.$id = "bus";
    this.$scope = "prototype";
    this.$parent = 'transport';

    this.$engine = null;
    this.licence = "${default.licence}"
};

Bus.prototype.run = function () {
    this.$engine.run();
    console.log('please show me your **  bus  ** licence, my licence is [ %s ]', this.licence);
};

Bearcat.module(Bus, typeof module !== 'undefined' ? module : {});
