import inquirer from "inquirer";
import i18N from "../i18n/index.js";

let key = "version";

export default async function (source = {}) {
    let answers = await inquirer.prompt([{
        name: key,
        type: "input",
        default: source[key],
        message: i18N.config[key]()
    }])

    source[key] = answers[key];
    return {
        [key]: answers[key]
    }
}