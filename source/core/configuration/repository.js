import inquirer from "inquirer";
import i18N from "../i18n/index.js";
import _ from "lodash";

export default async function (source = {}) {
    let defaultValue;
    try {
        defaultValue = source["repository"]["url"]
        if (defaultValue.indexOf("git+") != -1) {
            defaultValue = defaultValue.slice(4);
        }
    } catch (e) {}

    var github, authorName, projectName, issue, homepage;
    let answers = await inquirer.prompt([{
            name: "repository",
            type: "input",
            default: defaultValue,
            message: i18N.config["repository"]()
        },
        {
            name: "repository:more",
            type: "list",
            message: i18N.config["repository:more"](),
            choices: function (answers) {
                let repo = answers["repository"];
                if (repo.indexOf("github.com") != -1) {
                    github = true;
                    let result;
                    if (repo.slice(0, 4) == "http") {
                        result = repo.match(/github\.com\/(\S+)\/(\S+)/)
                    } else {
                        result = repo.match(/github\.com\:(\S+)\/(\S+)/)
                    }
                    authorName = result[1];
                    projectName = result[2].replace(".git", "");
                    issue = `https://github.com/${authorName}/${projectName}/issues`
                    homepage = `https://github.com/${authorName}/${projectName}#readme`;
                }

                let result = [{
                        name: i18N.config["repository:more:manual"](),
                        value: "manual"
                    },
                    {
                        name: i18N.config["repository:more:disabled"](),
                        value: "disabled"
                    }
                ]

                if (!issue || !homepage) {
                    result.unshift(new inquirer.Separator(i18N.config["repository:more:auto-failed"]()));
                } else {
                    result.unshift({
                        name: i18N.config["repository:more:auto"](issue, homepage),
                        value: "auto"
                    })
                }

                return result;

            },
            when(answers) {
                return answers["repository"] && answers["repository"].trim()
            }
        },
        {
            name: "repository:issue",
            type: "input",
            default: issue,
            message: i18N.config["repository:more:manual:issue"](),
            when(answers) {
                return answers["repository:more"]=="manual"
            }
        },
        {
            name: "repository:homepage",
            type: "input",
            default: homepage,
            message: i18N.config["repository:more:manual:homepage"](),
            when(answers) {
                return answers["repository:more"]=="manual"
            }
        },
    ])

    let result = {};

    if (github && authorName && projectName) {
        result["repository"] = {
            "type": "git",
            "url": `git+https://github.com/${authorName}/${projectName}.git`
        }
        if (answers["repository:more"] != "disabled") {
            if (answers["repository:more"] == "auto" && issue && homepage) {
                result["bugs"] = {
                    "url": issue
                }
                result["homepage"] = homepage;
            } else if (answers["repository:more"] == "manual") {
                result["bugs"] = {
                    "url": answers["repository:issue"]
                }
                result["homepage"] = answers["repository:homepage"];
            }
        }
    } else {
        result["repository"] = {
            "url": answers["repository"]
        }
        if (answers["repository:more"] != "disabled") {
            if (answers["repository:issue"]) {
                result["bugs"] = {
                    "url": answers["repository:issue"]
                }
            }
            if (answers["repository:homepage"]) {
                result["homepage"] = answers["repository:homepage"];
            }
        }
    }

    source = Object.assign(source, result);

    return result;
}