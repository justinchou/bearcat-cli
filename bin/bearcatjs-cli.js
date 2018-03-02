#!/usr/bin/env node

'use strict';

const Path = require('path');
const FS = require('fs');
const Program = require('commander');
const Chalk = require('chalk');
const Mkdirp = require('mkdirp');

const Utils = require('../lib/utils');

const PropertiesLoader = require('../node_modules/bearcatjs/lib/resource/propertiesLoader');
const ResourceLoader = require('../node_modules/bearcatjs/lib/resource/resourceLoader');
const Bearcat = require('bearcatjs');
Bearcat.createApp();

// 常量
process.env.LOADER_BIN = 'on';
const Version = require('../package.json').version;
const Templates = ['demo', 'express'];

// 全局变量
let rootPath = process.cwd();
let appName = 'bearcatjs-proj';
let template = Templates[0];
let params = {};

let resourceLoader = new ResourceLoader();
let propertiesLoader = new PropertiesLoader();

let defaultCpath = rootPath + '/context.json';
let defaultConfigPath = rootPath + '/config';
let defaultOutputFile = 'bearcatjs-bootstrap.js';
let defaultEnv = 'dev';

global.Bearcat = Bearcat;
global.bearcat = Bearcat;

/**
 * 从templates目录拷贝文件
 * @param {String} from 拷贝文件原路径 - 相对于 templates 的相对路径
 * @param {String} to 目标路径, 需要根据工程创建目录 path 拼接出完整路径
 * @returns {null} 无
 */
function copyTemplate(from, to) {
    from = Path.join(__dirname, '../templates/', template, from);
    Utils.write(to, FS.readFileSync(from, 'utf-8'));
}

/**
 * 创建文件夹, 封装调用 mkdirp
 * @param {String} path 文件夹路径
 * @param {Function=} fn (EMPTY_PARAMS)
 * @returns {null} 无
 */
function mkdir(path, fn) {
    Mkdirp(path, Utils.MODE_0755, function (err) {
        if (err) throw err;
        if (!params.silent) console.log(Chalk.green('   创建文件夹 : ') + path);
        fn && fn();
    });
}


Program.name('bearcatjs-cli').alias('bearcatjs').usage('[command] [options]').version(Version, '    --version');

Program.command('init').alias('i').usage('[options] [path]').description('初始化项目')
    .option('-t, --template [value]', '模板名称, 默认为 demo 默认模板, 支持 ' + Templates.join(', '))
    .option('-H, --hot', '使用热加载模式, 默认为false')
    .option('-s, --silent', '使用静默模式, 尽量减少日志')
    .option('    --git', '增加 .gitignore 文件')
    .option('-f, --force', '强制在非空目录下创建工程')
    .action(function (path) {

        let option = Utils.parseOption(arguments);
        params = Utils.parseParams(arguments);

        if (path instanceof Program.Command) {
            path = '.';
        }

        appName = Utils.createAppName(Path.resolve(path)) || appName;
        option.silent && (params.silent = true, Utils.setSilent(true));

        template = option.template || Templates[0];
        if (Templates.indexOf(template) === -1) {
            if (!params.silent) Utils.warning('没有找到名为 ' + template + ' 的模板, 使用默认模板 ' + Templates[0]);
            template = Templates[0];
        }

        option.hot && (params.hot = true);
        option.git && (params.git = true);
        option.force && (params.force = false);

        createProject(path);
    });

Program.command('generate')
    .alias('g')
    .description('给前端浏览器自动生成 bearcatjs-bootstrap.js 文件')
    .option('-o, --output [value]', '自定义 bearcatjs-bootstrap.js 文件名')
    .option('-c, --context [value]', '手动指定 context.json 文件路径')
    .option('-C, --config [value]', '指定 config 文件夹')
    .option('-e, --env [value]', '指定 config env 环境')
    .action(function() {
        let option = Utils.parseOption(arguments);
        params = Utils.parseParams(arguments);

        createBootstrapProject();
    });

Program.command('debug').alias('dbg').usage('[options]').description('输出本模块测试数据')
    .option('-c, --config [value]', '加载配置文件, 默认为 .bearcatjs.config.json')
    .action(function () {
        let option = Utils.parseOption(arguments);
        params = Utils.parseParams(arguments);

        let config = Utils.getConfig();
        if (!params.silent) console.log(config, option.config);
    });

Program.parse(process.argv);

/**
 * 调用工厂前的检查
 * @param {String} path 工程代码创建路径
 * @returns {null} 无
 */
function createProject(path) {
    Utils.emptyDirectory(path, function (empty) {
        if (empty || params.force) {
            createApplication(path);
        } else {
            Utils.confirm('目标文件夹非空, 是否继续? [y/N] ', function (ok) {
                if (ok) {
                    process.stdin.destroy();
                    createApplication(path);
                } else {
                    if (!params.silent) console.error(Chalk.red('aborting'));
                }
            });
        }
    });
}

/**
 * app生成工厂
 * @param {String} path 目标路径
 * @returns {null} 无
 */
function createApplication(path) {
    mkdir(path, () => {
        switch (template) {
            case Templates[0]:
            case 'demo':
                createDemoProject(path);
                break;
            case Templates[1]:
            case 'express':
                createExpressProject(path);
                break;
            default:
                break;
        }
    });
}

// Demo Project
function createDemoProject(path) {
    mkdir(path + '/garage', () => {
        copyTemplate('/garage/Aspect.js', path + '/garage/Aspect.js');

        copyTemplate('/garage/Engine.js', path + '/garage/Engine.js');

        copyTemplate('/garage/Transport.js', path + '/garage/Transport.js');

        copyTemplate('/garage/Car.js', path + '/garage/Car.js');
        copyTemplate('/garage/Moto.js', path + '/garage/Moto.js');

        copyTemplate('/garage/Bus.js', path + '/garage/Bus.js');
        copyTemplate('/garage/Truck.js', path + '/garage/Truck.js');
    });
    mkdir(path + '/producer', () => {
        copyTemplate('/producer/Aspection.js', path + '/producer/Aspection.js');
        copyTemplate('/producer/CanProduceAop.js', path + '/producer/CanProduceAop.js');
        copyTemplate('/producer/Producer.js', path + '/producer/Producer.js');
    });
    mkdir(path + '/lib', () => {
        copyTemplate('../shared/lib/bearcatjs.js', path + '/lib/bearcatjs.js');
    });
    mkdir(path + '/config', () => {
        mkdir(path + '/config/dev', () => {
            copyTemplate('/config/dev/default.json', path + '/config/dev/default.json');
            copyTemplate('/config/dev/bus.json', path + '/config/dev/bus.json');
            copyTemplate('/config/dev/truck.json', path + '/config/dev/truck.json');
        });
        mkdir(path + '/config/prod');
    });

    if (params.git) copyTemplate('../shared/gitignore', path + '/.gitignore');

    let context = {
        name: appName,
        scan: []
    };
    let index;
    if (params.hot) {
        index = 'hot.js';
        mkdir(path + '/hot');
        context.scan.push('hot');
    } else {
        index = 'app.js';
    }
    copyTemplate(index, path + '/' + index);
    copyTemplate('/app.html', path + '/app.html');

    context.scan.push('garage');
    context.scan.push('producer');
    Utils.write(path + '/context.json', JSON.stringify(context, null, 2) + '\n');

    let pkg = {
        name: appName,
        version: '0.0.0',
        licence: "MIT",
        scripts: {
            start: 'node ' + index
        },
        dependencies: {
            bearcatjs: 'latest'
        }
    };
    Utils.write(path + '/package.json', JSON.stringify(pkg, null, 2) + '\n');

    let config = {
        name: appName
    };
    Utils.write(path + '/.bearcatjs.config.json', JSON.stringify(config, null, 2) + '\n');
}

// Express Project
function createExpressProject(path) {
    mkdir(path + '/app', () => {
        copyTemplate('/app/BearLogger.js', path + '/app/BearLogger.js');
        copyTemplate('/app/BearController.js', path + '/app/BearController.js');
        copyTemplate('/app/UserController.js', path + '/app/UserController.js');
    });
    mkdir(path + '/bin', () => {
        copyTemplate('/bin/www', path + '/bin/www');
    });
    mkdir(path + '/public', () => {
        mkdir(path + '/public/images');
        mkdir(path + '/public/javascripts');
        mkdir(path + '/public/stylesheets', () => {
            copyTemplate('/public/stylesheets/style.css', path + '/public/stylesheets/style.css');
        });
    });
    mkdir(path + '/routes', () => {
        copyTemplate('/routes/index.js', path + '/routes/index.js');
        copyTemplate('/routes/users.js', path + '/routes/users.js');
    });
    mkdir(path + '/views', () => {
        copyTemplate('/views/error.jade', path + '/views/error.jade');
        copyTemplate('/views/index.jade', path + '/views/index.jade');
        copyTemplate('/views/layout.jade', path + '/views/layout.jade');
    });

    if (params.git) copyTemplate('../shared/gitignore', path + '/.gitignore');

    let context = {
        name: appName,
        scan: []
    };
    let index;
    if (params.hot) {
        index = 'hot.js';
        mkdir(path + '/hot');
        context.scan.push('hot');
    } else {
        index = 'app.js';
    }
    copyTemplate(index, path + '/app.js');

    context.scan.push('app');
    Utils.write(path + '/context.json', JSON.stringify(context, null, 2) + '\n');

    let pkg = {
        name: appName,
        version: '0.0.0',
        scripts: {
            start: 'node ./bin/www'
        },
        license: "MIT",
        dependencies: {
            bearcatjs: '*',
            'body-parser': '~1.17.1',
            'cookie-parser': '~1.4.3',
            express: '~4.15.2',
            jade: '~1.11.0'
        }
    };
    Utils.write(path + '/package.json', JSON.stringify(pkg, null, 2) + '\n');

    let config = {
        name: appName
    };
    Utils.write(path + '/.bearcatjs.config.json', JSON.stringify(config, null, 2) + '\n');
}

// Bootstrap Browser Project
function createBootstrapProject() {
    let base = params['base'];

    let contextPath = defaultCpath;
    if (params['context']) {
        contextPath = Path.join(rootPath, params['context']);
    }

    let outputFile = defaultOutputFile;
    if (params['output']) {
        outputFile = Path.join(rootPath, params['output']);
    }

    let configPath = defaultConfigPath;
    if (params['config']) {
        configPath = Path.join(rootPath, params['config']);
    }

    let env = defaultEnv;
    if (params['env']) {
        env = params['env'];
    }

    let metas = resourceLoader.load(contextPath);

    FS.writeFileSync(outputFile, 'let Root;\n');
    FS.appendFileSync(outputFile, '\(function\(\) \{ Root = this; \}\(\)\);\n');
    FS.appendFileSync(outputFile, 'Root.__bearcatData__ = {};\n');
    FS.appendFileSync(outputFile, 'Root.__bearcatData__.idPaths = {};\n');

    let idPaths = {};
    for (let id in metas) {
        let meta = metas[id];
        let fpath = meta['fpath'];
        let ftype = meta['ftype'];
        fpath = require.resolve(fpath);
        let p = process.cwd();
        if (base) {
            p = p + '/' + base;
        }

        idPaths[id] = Path.relative(p, fpath);
    }

    FS.appendFileSync(outputFile, '(function () {\n');
    FS.appendFileSync(outputFile, 'let idPaths = ' + JSON.stringify(idPaths) + ';\n');
    FS.appendFileSync(outputFile, 'Root.__bearcatData__.idPaths = idPaths;\n');
    FS.appendFileSync(outputFile, 'if(typeof bearcat === "undefined") {return;}\n');
    FS.appendFileSync(outputFile, 'bearcat.createApp\(\);\n');
    FS.appendFileSync(outputFile, '})();');

    console.log(Chalk.green('   生成前端文件: ') + outputFile);
}
