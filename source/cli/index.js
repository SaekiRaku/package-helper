import fs from "fs";
import path from "path";
import commander from "commander";
import info from "../../package.json";
import core from "../core/index.js";
import i18N from "../core/i18n/index.js";
import inquirer from "inquirer";

let matched = process.argv.join(" ").match(/(-l|--language)\ (en|zh-CN)/)
if (matched) {
    i18N.use(matched[0].split(" ")[1])
}

const program = new commander.Command();
program
    .name("package-helper")
    .description(i18N.cli.description())
    .arguments("<filepath:./package.json>")
    // .option("-f, --file <path>", "specified the path of project's package.json", "package.json")
    .option("-l, --language <en|zh-CN>", i18N.cli.language())
    .version(info.version, "-v, --version", i18N.cli.version())
    .helpOption("-h, --help", i18N.cli.help())

program.parse(process.argv);

let filepath = program.args[0] || process.cwd() + "/package.json";
if (!path.isAbsolute(filepath)) {
    filepath = path.resolve(process.cwd(), filepath);
}
if (path.basename(filepath) != "package.json") {
    filepath = path.resolve(filepath, "package.json");
}

if (!fs.existsSync(filepath)) {
    console.error(i18N.cli["error:not-exists"](filepath))
    process.exit(1);
}

let source;
try {
    source = JSON.parse(fs.readFileSync(filepath).toString());
} catch (e) {
    console.error(i18N.cli["error:failed"](filepath));
    process.exit(1);
}

(async () => {
    let list = await core.initial();
    let result = await core.config(list, source);
    console.log();
    console.log(source);
    console.log();
    let answers = await inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: i18N.cli.confirm()
    });
    if (answers.confirm) {
        fs.writeFileSync(filepath, core.format(source));
    }
})();