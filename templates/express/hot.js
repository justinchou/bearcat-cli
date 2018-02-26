'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bearcat = require('bearcat');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', function (req, res, next) {
    console.log('Request %s url %s baseUrl %s with body [ %j ] query [ %j ] params [ %j ] headers [ %j ]', req.method, req.url, req.baseUrl, req.body, req.query, req.params, req.headers);
    next();
});

let configPaths = [require.resolve('./context.json')];
bearcat.createApp(configPaths, {
    // NODE_ENV: '',
    // BEARCAT_ENV: '',
    // NODE_CPATH: '',
    // BEARCAT_CPATH: '',
    // BEARCAT_LOGGER: 'on',
    BEARCAT_HOT: 'on',
    BEARCAT_HPATH: path.join(__dirname, '/hot'),
    // BEARCAT_ANNOTATION: 'on',
    // BEARCAT_GLOBAL: false
});
bearcat.start(function () {
    console.log('Bearcat IoC container started');

    let index = require('./routes/index');
    let users = require('./routes/users');

    app.use('/', index);
    app.use('/users', users);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
});

module.exports = app;