'use strict';

const Path = require('path');
const FS = require('fs');
const Readline = require('readline');
const Chalk = require('chalk');
const Mkdirp = require('mkdirp');

const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

let rootPath = process.cwd();
let silent = false;

function nooooop() {
}

function setSilent(s) {
    silent = s;
}

/**
 * 获取 config 文件
 * @param {String|Function=} name 配置文件名
 * @param {Function=} next 回调方法
 * @returns {Object} 配置文件内容
 */
function getConfig(name, next) {

    if (arguments.length === 0) {
        next = nooooop;
        name = '.bearcat.config.json';
    } else if (arguments.length === 1) {
        if (typeof name === 'function') {
            next = name;
            name = '.bearcat.config.json';
        } else if (typeof name === 'string') {
            next = nooooop;
        }
    }

    if (typeof name !== 'string') {
        name = '.bearcat.config.json';
    }
    if (typeof next !== 'function') {
        next = nooooop();
    }

    let configPath = Path.join(process.cwd(), name);
    let config = {};
    if (FS.existsSync(configPath)) {
        try {
            config = JSON.parse(FS.readFileSync(configPath, 'utf-8'));
            next && next(config);
            return config;
        } catch (e) {
            console.log(Chalk.red('读取 ' + name + ' 文件失败'));
        }
    } else {
        console.log(Chalk.yellow('当前路径 ' + name + ' 文件不存在, 使用默认配置'));
    }
}

/**
 * 输出命令行交互, 获取是否允许的交互
 * @param {String} msg 弹出提示的信息
 * @param {Function} callback (Boolean)
 * @returns {null} 无
 */
function confirm(msg, callback) {
    let rl = Readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(msg, function (input) {
        rl.close();
        callback(/^y|yes|ok|true$/i.test(input));
    });
}

/**
 * 基于各种名称转化成指定格式的app格式
 * @param {String} name 转化前的 app 名称
 * @returns {string} 转化后的 app 名称
 */
function createAppName(name) {
    return Path.basename(name)
        .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
}

/**
 * 判断文件夹是否为空
 * @param {String} path 文件夹路径
 * @param {Function} fn (Boolean)
 * @returns {null} 无
 */
function emptyDirectory(path, fn) {
    FS.readdir(path, function (err, files) {
        if (err && err.code !== 'ENOENT') throw err;
        fn(!files || !files.length);
    });
}

/**
 * 输出Warning数据
 * @param {String} message 输出的内容
 * @returns {null} 无
 */
function warning(message) {
    console.error();
    message.split('\n').forEach(function (line) {
        console.error(Chalk.red('  warning: ' + line));
    });
    console.error();
}

/**
 * 将字符串数据写入文件
 * @param {String} path 目标文件路径
 * @param {String} str 需要写入的内容
 * @param {Number=} mode 文件rwx权限
 * @returns {null} 无
 */
function write(path, str, mode) {
    FS.writeFileSync(path, str, {mode: mode || MODE_0666});
    if (!silent) console.log(Chalk.green('   创建文件   : ') + path);
}

/**
 * 解析action回调后获取的数据
 * @param {Object} args 从action回调得到的arguments
 * @returns {Command} Commander对象
 */
function parseOption(args) {
    // 防止传入多个没有 --xx 的参数
    let arr = Array.prototype.slice.apply(args);
    let option = arr.pop();

    let parmas = {};
    for (let i in option) {
        if (option.hasOwnProperty(i)) {
            if (!i.match(/^_|^commands$|^options$|^parent$/)) {
                parmas[i] = option[i];
            }
        }
    }

    if (!silent) console.log();
    if (!silent) console.log(Chalk.green('   运行环境为:  ') + rootPath);
    if (!silent) console.log(Chalk.green('   传入参数为:  ') + arr.join('  '));
    if (!silent) console.log(Chalk.green('   开关选项为:  ') + JSON.stringify(parmas));
    if (!silent) console.log();

    return option;
}

function parseParams(args) {
    // 防止传入多个没有 --xx 的参数
    let arr = Array.prototype.slice.apply(args);
    let option = arr.pop();

    let parmas = {};
    for (let i in option) {
        if (option.hasOwnProperty(i)) {
            if (!i.match(/^_|^commands$|^options$|^parent$/)) {
                parmas[i] = option[i];
            }
        }
    }

    return parmas;
}

module.exports = {
    MODE_0666: MODE_0666,
    MODE_0755: MODE_0755,
    setSilent: setSilent,
    getConfig: getConfig,
    confirm: confirm,
    createAppName: createAppName,
    emptyDirectory: emptyDirectory,
    warning: warning,
    write: write,
    parseOption: parseOption,
    parseParams: parseParams
};