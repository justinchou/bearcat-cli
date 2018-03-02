'use strict';

let Transport = function Transport() {
    this.$id = 'transport';
    // this.$proxy  = false;
    this.$abstract = true;
};

Transport.prototype.run = function () {
    throw new Error('Abstract Function run Called');
};

bearcat.module(Transport, typeof module !== 'undefined' ? module : {});
