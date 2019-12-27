# Package Helper

> Other languages / 其他语言:  
> [English](./README.md) | [简体中文](./README.zh_CN.md)  

一个通过交互式命令行辅助你修改 package.json 的工具

## 特性

- 交互式命令行
- 国际化支持中文和英文
- 可以用作 NodeJS 模块

![Screen Capture](./capture.png)

## 使用说明

### 安装

```bash
npm i -g @qiqi1996/package-helper
```

### 命令行

```bash
package-helper
# 将读取/解析/修改当前工作目录的 package.json
package-helper /path/to/package.json
# 指定 package.json 路径
```

```bash
package-helper -h
# 查看使用说明

Usage: package-helper [options] <filepath:./package.json>

一个通过交互式命令行辅助你修改 package.json 的工具

Options:
  -l, --language <en|zh-CN>  指定输出所使用的语言。默认情况下使用系统语言。
  -v, --version              输出当前版本
  -h, --help                 输出使用说明
```

### 作为模块

```javascript
const helper = require("@qiqi1996/package-helper");

(async()=>{
    let source = {};
    // 您可以将 `package.json` 内容读取到 `source`，所有来自用户的输入都将合并到其中。

    let list = [ "name", "description" ];
    // 引导用户输入 `package.json` 的这些属性。
    // 如果 `list` 是一个空数组，`package-helper` 将询问用户他们想要添加或修改 `package.json` 的哪些属性。

    helper.locale("zh-CN");
    // 设置输出语言。在默认情况下，它将使用您的系统语言。
    // 中文 - zh-CN
    // 英语 - en

    let result = await helper.guide(list, source);
    // `list` 和 `source` 都是可选的。
    // `result` 是合并到 `source` 之前用户输入的数据。
    // 请注意：source 将会被修改。

    let json = helper.format(source)
    // 获取格式化的 json 字符串
})()
```

## 协议

MIT

Copyright 2019(c), qiqi1996.com. All right reserved.