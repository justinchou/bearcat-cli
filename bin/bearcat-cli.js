#!/usr/bin/env node

/**
 * Created by bearcat-cli.
 * File: init.js
 * User: justin
 * Date: 25/2/2018
 * Time: 12:59
 */

'use strict';

const Path      = require('path');
const Readline  = require('readline');
const FS        = require('fs');
const Program   = require('commander');
const Chalk     = require('chalk');
const Mkdirp    = require('mkdirp');

const Utils     = require('../lib/utils');

// 常量
const Version   = require('../package.json').version;
const Templates = ["demo", "express"];
const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

// 全局变量
let rootPath    = process.cwd();
let appName     = 'bearcat-proj';
let template    = Templates[0];
let silent      = false;
let hot         = false;
let git         = false;
let force       = false;

Program.name('bearcat-cli').usage('[command] [options]').version(Version, '    --version');

Program.command('init').alias('i').usage('[options] [path]').description('初始化项目')
    .option('-n, --name [value]', '模板名称, 默认为 demo 默认模板, 支持 ' + Templates.join(", "))
    .option('-H, --hot', '使用热加载模式, 默认为false')
    .option('-s, --silent', "使用静默模式, 尽量减少日志")
    .option('    --git', '增加 .gitignore 文件')
    .option('-f, --force', '强制在非空目录下创建工程')
    .action(function (path) {

        let option = parseOption(arguments);

        if (path instanceof Program.Command) {
            path = ".";
        }

        appName = createAppName(Path.resolve(path)) || appName;
        option.silent && (silent = true);

        template = option.name || Templates[0];
        if (Templates.indexOf(template) === -1) {
            template = Templates[0];
        }

        option.hot && (hot = true);
        option.git && (git = true);
        option.force && (force = false);

        createProject(path);
    });

Program.command('debug').alias('dbg').usage('[options]').description('输出本模块测试数据')
    .option('-c, --config [value]', '加载配置文件, 默认为 .bearcat.config.json')
    .action(function () {
        let option = parseOption(arguments);

        let config = Utils.getConfig();
        console.log(config, option.config);
    });

Program.parse(process.argv);

/**
 * 调用工厂前的检查
 * @param {String} path
 */
function createProject(path) {
    emptyDirectory(path, function (empty) {
        if (empty || force) {
            createApplication(path);
        } else {
            confirm('目标文件夹非空, 是否继续? [y/N] ', function (ok) {
                if (ok) {
                    process.stdin.destroy();
                    createApplication(path)
                } else {
                    console.error(Chalk.red('aborting'));
                }
            });
        }
    });
}

/**
 * app生成工厂
 * @param {String} path 目标路径
 */
function createApplication(path) {
    mkdir(path, () => {
        switch (template) {
            case Templates[0]:
            case "demo":
                createDemoProject(path);
                break;
            case Templates[1]:
            case "express":

                break;
            default:
                break;
        }
    });
}

// Demo Project
function createDemoProject(path) {
    mkdir(path + '/app', () => {
        copyTemplate('/app/Engine.js', path + '/app/Engine.js');

        copyTemplate('/app/Transport.js', path + '/app/Transport.js');

        copyTemplate('/app/Car.js', path + '/app/Car.js');
        copyTemplate('/app/Moto.js', path + '/app/Moto.js');

        copyTemplate('/app/Bus.js', path + '/app/Bus.js');
        copyTemplate('/app/Truck.js', path + '/app/Truck.js');
    });
    mkdir(path + '/config', () => {
        mkdir(path + '/config/dev', () => {
            copyTemplate('/config/dev/bus.json', path + '/config/dev/bus.json');
            copyTemplate('/config/dev/truck.json', path + '/config/dev/truck.json');
        });
        mkdir(path + '/config/prod');
    });

    if (git) copyTemplate('../shared/gitignore', path + '/.gitignore');

    let context = {
        "name": appName,
        "scan": []
    };
    let index;
    if (hot) {
        index = "hot.js";
        mkdir(path + '/hot');
        context.scan.push("hot");
    } else {
        index = "app.js";
    }
    copyTemplate(index, path + '/' + index);

    context.scan.push("app");
    write(path + '/context.json', JSON.stringify(context, null, 2) + "\n");

    let pkg = {
        name: appName,
        version: '0.0.0',
        private: true,
        scripts: {
            start: 'node ' + index
        },
        dependencies: {
            'bearcat': 'latest'
        }
    };
    write(path + '/package.json', JSON.stringify(pkg, null, 2) + "\n");

    let config = {
        "name": appName
    };
    write(path + '/.bearcat.config.json', JSON.stringify(config, null, 2) + '\n');
}

/**
 * 输出命令行交互, 获取是否允许的交互
 * @param {String} msg
 * @param {Function} callback (Boolean)
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
 * 从templates目录拷贝文件
 * @param from
 * @param to
 */
function copyTemplate(from, to) {
    from = Path.join(__dirname, '../templates/', template, from);
    write(to, FS.readFileSync(from, 'utf-8'));
}

/**
 * 基于各种名称转化成指定格式的app格式
 * @param {String} name
 * @returns {string}
 */
function createAppName(name) {
    return Path.basename(name)
        .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
}

/**
 * 判断文件夹是否为空
 * @param {String} path
 * @param {Function} fn (Boolean)
 */
function emptyDirectory(path, fn) {
    FS.readdir(path, function (err, files) {
        if (err && err.code !== 'ENOENT') throw err;
        fn(!files || !files.length)
    });
}

/**
 * 创建文件夹, 封装调用 mkdirp
 * @param {String} path
 * @param {Function=} fn (EMPTY_PARAMS)
 */
function mkdir(path, fn) {
    Mkdirp(path, MODE_0755, function (err) {
        if (err) throw err;
        console.log(Chalk.green('   创建文件夹 : ') + path);
        fn && fn();
    });
}

/**
 * 输出Warning数据
 * @param {String} message
 */
function warning(message) {
    console.error();
    message.split('\n').forEach(function (line) {
        console.error('  warning: %s', line);
    });
    console.error();
}

/**
 * 将字符串数据写入文件
 * @param {String} path
 * @param {String} str
 * @param {Number=} mode
 */
function write(path, str, mode) {
    FS.writeFileSync(path, str, {mode: mode || MODE_0666});
    console.log(Chalk.green('   创建文件   : ') + path);
}

/**
 * 解析action回调后获取的数据
 * @param {Object} args
 * @returns {Command}
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

    console.log();
    console.log(Chalk.green("   传入参数为:  ") + arr.join('  '));
    console.log(Chalk.green("   开关选项为:  ") + JSON.stringify(parmas));
    console.log();

    return option;
}