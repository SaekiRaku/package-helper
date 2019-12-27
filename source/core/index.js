import inquirer from "inquirer";
import i18N from "./i18n/index.js";
import configuration from "./configuration/index.js";
import jsonFormat from "json-format";
import _ from "lodash";

async function initial() {
    const initialQuestion = [{
        name: "initial",
        type: "checkbox",
        message: i18N.initial["question"](),
        validate(answer) {
            if (answer.length == 0) {
                return i18N.initial["error:empty"]()
            }
            return true
        },
        choices: [
            new inquirer.Separator(i18N.initial["project info"]()),
            {
                name: i18N.initial["name"](),
                value: "name"
            },
            {
                name: i18N.initial["description"](),
                value: "description"
            },
            {
                name: i18N.initial["version"](),
                value: "version"
            },
            {
                name: i18N.initial["repository"](),
                value: "repository"
            },
        ]
    }]
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
    for (let i in i18N) {
        i18N[i].use(language);
    }
}

function format(json) {
    return jsonFormat(json, {
        type: 'space',
        size: 2
    });
}

export default {
    initial,
    config,
    format,
    locale
}