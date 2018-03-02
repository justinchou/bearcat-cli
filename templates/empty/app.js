/**
 * Created by bearcatjs-cli.
 * File: app.js
 * User: justin
 * Date: 2/3/2018
 * Time: 15:13
 */

'use strict';

const bearcat = require('bearcatjs');
let configPaths = [require.resolve('./context.json')];

bearcat.createApp(configPaths, {
    BEARCAT_GLOBAL: true
});
bearcat.start(function () {
    console.log('Bearcat IoC container started');

});