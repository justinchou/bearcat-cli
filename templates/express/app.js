'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bearcat = require('bearcatjs');

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

let configPaths = [require.resolve('./context.json')];
bearcat.createApp(configPaths, {
    // NODE_ENV: '',
    // BEARCAT_ENV: '',
    // NODE_CPATH: '',
    // BEARCAT_CPATH: '',
    // BEARCAT_LOGGER: 'on',
    // BEARCAT_HOT: 'off',
    // BEARCAT_HPATH: path.join(__dirname, '/hot'),
    // BEARCAT_ANNOTATION: 'on',
    BEARCAT_GLOBAL: true
});
bearcat.start(function () {
    console.log('Bearcat IoC container started');

    app.use('*', bearcat.getRoute('bearLogger', 'logAllReq'));

    let index = require('./routes/index');
    let users = require('./routes/users');

    app.use('/', index);
    app.use('/users', users);

    // catch 404 and forward to error handler
    app.use(bearcat.getRoute('bearController', 'noRouter'));

    // error handler
    app.use(bearcat.getRoute('bearController', 'retError'));
});

module.exports = app;