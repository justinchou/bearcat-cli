'use strict';

const Bearcat = require('bearcat');

let Transport = function Transport() {
    this.$id = "transport";
    this.$abstract = true;
};

Transport.prototype.run = function () {
    throw new Error('Abstract Function run Called');
};

Bearcat.module(Transport, typeof module !== 'undefined' ? module : {});
