'use strict';

let BearController = function BearController() {
    this.$id = 'bearController';
};

BearController.prototype.index = function (req, res, next) {
    console.log('Router BearController');
    console.log(req.query);
    console.log(req.body);
    res.render('index', {title: 'Express'});
};

BearController.prototype.noRouter = function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
};

BearController.prototype.retError = function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
};

bearcat.module(BearController, typeof module !== 'undefined' ? module : {});
