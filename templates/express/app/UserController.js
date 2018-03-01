'use strict';

let UserController = function UserController() {
    this.$id = 'userController';
};

UserController.prototype.index = function(req, res, next) {
    res.send('respond with a resource');
};

bearcat.module(UserController, typeof module !== 'undefined' ? module : {});