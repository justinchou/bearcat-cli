'use strict';

const Bearcat = require('bearcat');

let Truck = function Truck() {
    this.engine = null;
    this.licence = null;
};

Truck.prototype.run = function () {
    this.engine.run();
    console.log('please show me your ** truck ** licence, my licence is [ %s ]', this.licence);
};

module.exports = {
    id: "truck",
    func: Truck,
    scope: "prototype",
    parent: "transport",
    props: [{
        name: "engine",
        ref: "engine"
    }, {
        name: "licence",
        value: "${default.licence}"
    }]
};