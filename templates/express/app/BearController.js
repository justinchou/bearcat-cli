'use strict';

let BearController = function BearController() {
    this.$id = "bearController";
};

BearController.prototype.index = function (req, res, next) {
    console.log('Router BearController');
    console.log(req.query);
    console.log(req.body);
    res.render('index', {title: 'Express'});
};

module.exports = BearController;
