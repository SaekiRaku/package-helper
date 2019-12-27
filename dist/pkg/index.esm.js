import inquirer from 'inquirer';
import locale$1 from 'os-locale';
import i18N from '@qiqi1996/qi-i18n-node';
import _ from 'lodash';
import jsonFormat from 'json-format';

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
async function description (source = {}) {
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
async function name (source = {}) {
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

async function repository (source = {}) {
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
async function version (source = {}) {
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
  description,
  name,
  repository,
  version
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

class PackageHelper {
  /**
   * Set the output language of PackageHelper.
   * @param {String} language - For example: "zh-CN", default is "en".
   */
  static locale(language) {
    result.use(language);
  }

  static format(json) {
    return core.format(json);
  }

  static async guide(list = [], source = {}) {
    let l;

    if (Array.isArray(list) && list.length) {
      l = list;
    } else {
      l = await core.initial();
    }

    return await core.config(l, source);
  }

}

export default PackageHelper;
