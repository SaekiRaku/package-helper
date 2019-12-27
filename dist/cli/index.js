#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var commander = _interopDefault(require('commander'));
var inquirer = _interopDefault(require('inquirer'));
var locale$1 = _interopDefault(require('os-locale'));
var i18N = _interopDefault(require('@qiqi1996/qi-i18n-node'));
var _ = _interopDefault(require('lodash'));
var jsonFormat = _interopDefault(require('json-format'));

var name = "@qiqi1996/package-helper";
var version = "1.0.0";
var description = "A tool helps you to edit the package.json by interactive command line.";
var main = "dist/pkg/index.js";
var module$1 = "dist/pkg/index.esm.js";
var bin = {
	"package-helper": "dist/cli/index.js"
};
var scripts = {
	dev: "node -r esm bootstrap.js develop",
	build: "node -r esm bootstrap.js build"
};
var repository = {
	type: "git",
	url: "git+https://github.com/SaekiRaku/package-helper.git"
};
var author = "qiqi1996";
var license = "MIT";
var bugs = {
	url: "https://github.com/SaekiRaku/package-helper/issues"
};
var homepage = "https://github.com/SaekiRaku/package-helper#readme";
var devDependencies = {
	"@babel/core": "^7.7.7",
	"@babel/plugin-proposal-class-properties": "^7.7.4",
	"@babel/preset-env": "^7.7.7",
	"@qiqi1996/qi-auto": "^1.2.2",
	"@qiqi1996/qi-rollup-dev": "^1.1.0",
	"@rollup/plugin-json": "^4.0.1",
	"@rollup/plugin-strip": "^1.3.1",
	esm: "^3.2.25",
	rollup: "^1.27.14",
	"rollup-plugin-babel": "^4.3.3",
	"rollup-plugin-banner": "^0.2.1"
};
var dependencies = {
	"@qiqi1996/qi-i18n-node": "^1.1.0",
	commander: "^4.0.1",
	inquirer: "^7.0.1",
	"json-format": "^1.0.1",
	lodash: "^4.17.15",
	"os-locale": "^4.0.0"
};
var info = {
	name: name,
	version: version,
	description: description,
	main: main,
	module: module$1,
	bin: bin,
	scripts: scripts,
	repository: repository,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	dependencies: dependencies
};

var translation_initial = {
  "question": {
    "en": "Which attributes of package.json do you want to add/modify\\?",
    "zh-CN": "您想添加/修改 package.json 的哪些属性呢？"
  },
  "project info": {
    "en": "Project Info",
    "zh-CN": "项目信息"
  },
  "error:empty": {
    "en": "At least choose 1 item (use space)",
    "zh-CN": "至少选中其中一项（使用空格键）"
  },
  "name": {
    "en": "name",
    "zh-CN": "name（项目名称）"
  },
  "description": {
    "en": "description",
    "zh-CN": "description（描述）"
  },
  "version": {
    "en": "version",
    "zh-CN": "version（版本号）"
  },
  "repository": {
    "en": "repository（Including the link of homepage and issue）",
    "zh-CN": "repository（仓库地址：包含首页和 issue 页面的地址）"
  }
};

var translation_config = {
  "name": {
    "en": "Please input the project name: ",
    "zh-CN": "请输入项目名称："
  },
  "description": {
    "en": "Please input the project description: ",
    "zh-CN": "请输入项目描述："
  },
  "version": {
    "en": "Please input the version: ",
    "zh-CN": "请输入版本号："
  },
  "repository": {
    "en": "Please input the url of the repository: ",
    "zh-CN": "请输入仓库地址："
  },
  "repository:more": {
    "en": "Do you want to add the link of `issue` and `homepage` for your project\\?",
    "zh-CN": "是否需要为项目添加 issue 和 首页 地址？"
  },
  "repository:more:auto": {
    "en": "Use the link that parsed from the repository url automatically",
    "zh-CN": "根据仓库地址自动解析相关链接" // "en": "Use the link that parsed from the repository url automatically(?)(?)",
    // "zh-CN": "根据仓库地址自动解析相关链接（?）（?）"

  },
  "repository:more:auto-failed": {
    "en": "Use the link that parsed from the repository url automatically (Parse failed)",
    "zh-CN": "根据仓库地址自动解析相关链接（解析失败）"
  },
  "repository:more:manual": {
    "en": "Use the link that manually input",
    "zh-CN": "手动输入链接"
  },
  "repository:more:manual:homepage": {
    "en": "Please input the url of project's homepage: ",
    "zh-CN": "请输入项目首页地址："
  },
  "repository:more:manual:issue": {
    "en": "Please input the url of project's issue: ",
    "zh-CN": "请输入项目 issue 地址："
  },
  "repository:more:disabled": {
    "en": "No need",
    "zh-CN": "不需要"
  },
  "license": {
    "en": "Please choose a license for your project",
    "zh-CN": "请为您的项目选择一个协议"
  }
};

var translation_cli = {
  // Command lines
  "description": {
    "en": "A tool helps you to edit the package.json by interactive command line.",
    "zh-CN": "一个通过交互式命令行辅助你修改 package.json 的工具"
  },
  "language": {
    "en": "specified the language of the output. For default situation, it will use your system language.",
    "zh-CN": "指定输出所使用的语言。默认情况下使用系统语言。"
  },
  "version": {
    "en": "output the current version",
    "zh-CN": "输出当前版本"
  },
  "help": {
    "en": "output usage information",
    "zh-CN": "输出使用说明"
  },
  "confirm": {
    "en": "Are you sure to write these content to package.json \\?",
    "zh-CN": "是否确认将这些内容写入 package.json？"
  },
  // Errors
  "error:not-exists": {
    "en": "package.json is not exists (?)",
    "zh-CN": "package.json 文件不存在（?）"
  },
  "error:faild": {
    "en": "Failed to read/parse the package.json (?)",
    "zh-CN": "无法读取/解析 package.json 文件（?）"
  }
};

const SYSTEM_LANGUAGE = locale$1.sync();

function make(t) {
  var scope = new i18N();

  if (SYSTEM_LANGUAGE == "zh-CN") {
    scope.config.use("zh-CN");
  }

  for (let key in t) {
    scope.add(key, scope.translation(t[key]));
  }

  return scope;
}

function use(language) {
  for (let i in this) {
    if (i == "use") {
      continue;
    }

    this[i].config.use(language);
  }
}

var result = {
  initial: make(translation_initial),
  config: make(translation_config),
  cli: make(translation_cli),
  use
};

let key = "description";
async function description$1 (source = {}) {
  let answers = await inquirer.prompt([{
    name: key,
    type: "input",
    default: source[key],
    message: result.config[key]()
  }]);
  source[key] = answers[key];
  return {
    [key]: answers[key]
  };
}

let key$1 = "name";
async function name$1 (source = {}) {
  let answers = await inquirer.prompt([{
    name: key$1,
    type: "input",
    default: source[key$1],
    message: result.config[key$1]()
  }]);
  source[key$1] = answers[key$1];
  return {
    [key$1]: answers[key$1]
  };
}

async function repository$1 (source = {}) {
  let defaultValue;

  try {
    defaultValue = source["repository"]["url"];

    if (defaultValue.indexOf("git+") != -1) {
      defaultValue = defaultValue.slice(4);
    }
  } catch (e) {}

  var github, authorName, projectName, issue, homepage;
  let answers = await inquirer.prompt([{
    name: "repository",
    type: "input",
    default: defaultValue,
    message: result.config["repository"]()
  }, {
    name: "repository:more",
    type: "list",
    message: result.config["repository:more"](),
    choices: function (answers) {
      let repo = answers["repository"];

      if (repo.indexOf("github.com") != -1) {
        github = true;
        let result;

        if (repo.slice(0, 4) == "http") {
          result = repo.match(/github\.com\/(\S+)\/(\S+)/);
        } else {
          result = repo.match(/github\.com\:(\S+)\/(\S+)/);
        }

        authorName = result[1];
        projectName = result[2].replace(".git", "");
        issue = `https://github.com/${authorName}/${projectName}/issues`;
        homepage = `https://github.com/${authorName}/${projectName}#readme`;
      }

      let result$1 = [{
        name: result.config["repository:more:manual"](),
        value: "manual"
      }, {
        name: result.config["repository:more:disabled"](),
        value: "disabled"
      }];

      if (!issue || !homepage) {
        result$1.unshift(new inquirer.Separator(result.config["repository:more:auto-failed"]()));
      } else {
        result$1.unshift({
          name: result.config["repository:more:auto"](issue, homepage),
          value: "auto"
        });
      }

      return result$1;
    },

    when(answers) {
      return answers["repository"] && answers["repository"].trim();
    }

  }, {
    name: "repository:issue",
    type: "input",
    default: issue,
    message: result.config["repository:more:manual:issue"](),

    when(answers) {
      return answers["repository:more"] == "manual";
    }

  }, {
    name: "repository:homepage",
    type: "input",
    default: homepage,
    message: result.config["repository:more:manual:homepage"](),

    when(answers) {
      return answers["repository:more"] == "manual";
    }

  }]);
  let result$1 = {};

  if (github && authorName && projectName) {
    result$1["repository"] = {
      "type": "git",
      "url": `git+https://github.com/${authorName}/${projectName}.git`
    };

    if (answers["repository:more"] != "disabled") {
      if (answers["repository:more"] == "auto" && issue && homepage) {
        result$1["bugs"] = {
          "url": issue
        };
        result$1["homepage"] = homepage;
      } else if (answers["repository:more"] == "manual") {
        result$1["bugs"] = {
          "url": answers["repository:issue"]
        };
        result$1["homepage"] = answers["repository:homepage"];
      }
    }
  } else {
    result$1["repository"] = {
      "url": answers["repository"]
    };

    if (answers["repository:more"] != "disabled") {
      if (answers["repository:issue"]) {
        result$1["bugs"] = {
          "url": answers["repository:issue"]
        };
      }

      if (answers["repository:homepage"]) {
        result$1["homepage"] = answers["repository:homepage"];
      }
    }
  }

  source = Object.assign(source, result$1);
  return result$1;
}

let key$2 = "version";
async function version$1 (source = {}) {
  let answers = await inquirer.prompt([{
    name: key$2,
    type: "input",
    default: source[key$2],
    message: result.config[key$2]()
  }]);
  source[key$2] = answers[key$2];
  return {
    [key$2]: answers[key$2]
  };
}

// QI-AUTO-EXPORT
var configuration = {
  description: description$1,
  name: name$1,
  repository: repository$1,
  version: version$1
};

async function initial() {
  const initialQuestion = [{
    name: "initial",
    type: "checkbox",
    message: result.initial["question"](),

    validate(answer) {
      if (answer.length == 0) {
        return result.initial["error:empty"]();
      }

      return true;
    },

    choices: [new inquirer.Separator(result.initial["project info"]()), {
      name: result.initial["name"](),
      value: "name"
    }, {
      name: result.initial["description"](),
      value: "description"
    }, {
      name: result.initial["version"](),
      value: "version"
    }, {
      name: result.initial["repository"](),
      value: "repository"
    }]
  }];
  let answers = await inquirer.prompt(initialQuestion);
  return answers["initial"];
}

async function config(list, source = {}) {
  let result = {};

  for (let item in list) {
    if (!configuration[list[item]]) {
      continue;
    }

    let c = await configuration[list[item]](source);
    result = _.merge(result, c);
  }

  return result;
}

function locale(language = "en") {
  for (let i in result) {
    result[i].use(language);
  }
}

function format(json) {
  return jsonFormat(json, {
    type: 'space',
    size: 2
  });
}

var core = {
  initial,
  config,
  format,
  locale
};

let matched = process.argv.join(" ").match(/(-l|--language)\ (en|zh-CN)/);

if (matched) {
  result.use(matched[0].split(" ")[1]);
}

const program = new commander.Command();
program.name("package-helper").description(result.cli.description()).arguments("<filepath:./package.json>") // .option("-f, --file <path>", "specified the path of project's package.json", "package.json")
.option("-l, --language <en|zh-CN>", result.cli.language()).version(info.version, "-v, --version", result.cli.version()).helpOption("-h, --help", result.cli.help());
program.parse(process.argv);
let filepath = program.args[0] || process.cwd() + "/package.json";

if (!path.isAbsolute(filepath)) {
  filepath = path.resolve(process.cwd(), filepath);
}

if (path.basename(filepath) != "package.json") {
  filepath = path.resolve(filepath, "package.json");
}

if (!fs.existsSync(filepath)) {
  console.error(result.cli["error:not-exists"](filepath));
  process.exit(1);
}

let source;

try {
  source = JSON.parse(fs.readFileSync(filepath).toString());
} catch (e) {
  console.error(result.cli["error:failed"](filepath));
  process.exit(1);
}

(async () => {
  let list = await core.initial();
  let result$1 = await core.config(list, source);
  console.log();
  console.log(source);
  console.log();
  let answers = await inquirer.prompt({
    name: "confirm",
    type: "confirm",
    message: result.cli.confirm()
  });

  if (answers.confirm) {
    fs.writeFileSync(filepath, core.format(source));
  }
})();
