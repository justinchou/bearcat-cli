/**
 * Created by bearcat-cli.
 * File: utils.js
 * User: justin
 * Date: 25/2/2018
 * Time: 13:04
 */

'use strict';

let Path = require('path');
let FS = require('fs');
let Chalk = require('chalk');

function nooooop() {};

module.exports = {
    /**
     * 获取 config 文件
     */
    getConfig: function (name, next) {

        if (arguments.length === 0) {
            next = nooooop;
            name = ".bearcat.config.json";
        } else if (arguments.length === 1) {
            if (typeof name === 'function') {
                next = name;
                name = ".bearcat.config.json";
            } else if (typeof name === 'string') {
                next = nooooop;
            }
        }

        if (typeof name !== 'string') {
            name = ".bearcat.config.json";
        }
        if (typeof next !== 'function') {
            next = nooooop();
        }

        let configPath = Path.join(process.cwd(), name);
        let config = {};
        if (FS.existsSync(configPath)) {
            try {
                config = JSON.parse(FS.readFileSync(configPath, "utf-8"));
                next && next(config);
                return config;
            } catch (e) {
                console.log(Chalk.red("读取 " + name + " 文件失败"));
            }
        } else {
            console.log(Chalk.yellow("当前路径 " + name + " 文件不存在, 使用默认配置"));
        }
    }
};