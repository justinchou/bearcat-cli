Bearcat Cli 命令行工具
===

[![BearCat Logo][express-logo]](http://bearcatjs.cn/)

[Bearcat Cli](https://www.npmjs.com/package/bearcat-cli) 是用于自动化生成基于 [Bearcat](https://www.npmjs.com/package/bearcat) 框架的初始化代码的工具.

[![BEARCAT Version][bearcat-cli-image]][bearcat-cli-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## 安装

通过npm管理

```bash
npm install -g bearcat-cli
```

如果你习惯了yarn, 那么:

```bash
yarn global add bearcat-cli
```


## 快速开始

最快速的开始Bearcat的方式, 就是执行 `bearcat-cli` 命令行工具, 生成一个可以运行的程序:

创建Demo应用:

```bash
bearcat-cli init demo-app  && cd demo-app
```

使用npm安装依赖:

```bash
npm install
```

启动程序:

```bash
$ npm start
```

## 命令行选项

工具还可以根据其他选项生成更自定义化的工程:

    Usage: bearcat-cli [command] [options]
    
    Options:
  
          --version  输出版本号
      -h, --help     输出帮助信息

    Commands:
  
      init|i [options]     初始化项目
      debug|dbg [options]  输出本模块测试数据

根据不同项目类型生成项目

    Usage: init|i [options] [path]
  
    初始化项目
    
    Options:
  
      -n, --name [value]  模板名称, 默认为 demo 默认模板, 支持 demo, express
      -H, --hot           使用热加载模式, 默认为false
      -s, --silent        使用静默模式, 尽量减少日志
          --git           增加 .gitignore 文件
      -f, --force         强制在非空目录下创建工程
      -h, --help          output usage information

## License

[MIT](LICENSE)

[express-logo]: https://bearcatjs.cn/images/logo.png

[bearcat-cli-image]: https://img.shields.io/badge/bearcat--cli-v0.0.3-brightgreen.svg
[bearcat-cli-url]: https://npmjs.org/package/bearcat-cli

[npm-image]: https://img.shields.io/npm/v/bearcat-cli.svg
[npm-url]: https://npmjs.org/package/bearcat-cli

[downloads-image]: https://img.shields.io/npm/dm/bearcat-cli.svg
[downloads-url]: https://npmjs.org/package/bearcat-cli
