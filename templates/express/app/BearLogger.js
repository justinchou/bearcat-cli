/**
 * Created by bearcatjs-cli.
 * File: BearLogger.js
 * User: justin
 * Date: 1/3/2018
 * Time: 19:22
 */

'use strict';

let BearLogger = function BearLogger() {
    this.$id = "bearLogger";
};

BearLogger.prototype.logAllReq = function (req, res, next) {
    console.log('Request %s url [ %s ] baseUrl [ %s ] with body [ %j ] query [ %j ] params [ %j ] headers [ %j ]', req.method, req.url, req.baseUrl, req.body, req.query, req.params, req.headers);
    next();
};

bearcat.module(BearLogger, typeof module !== 'undefined' ? module : {});