import QiAuto from "@qiqi1996/qi-auto";
import dev from "@qiqi1996/qi-rollup-dev";

import strip from "@rollup/plugin-strip";
import babel from "rollup-plugin-babel";
import json from "@rollup/plugin-json";

const command = process.argv[2];

function DevWrapper(scope) {
    let result = new dev({
        name: "PackageHelper",
        input: __dirname + `/source/${scope}/index.js`,
        output: __dirname + `/dist/${scope}/index.js`
    })

    result.config.external = ["fs", "path", "json-format", "os-locale", "@qiqi1996/qi-i18n-node", "inquirer", "lodash", "commander"]
    result.config.plugins = [babel(), json(), strip()]

    return result;
}

var cli = DevWrapper("cli");
var pkg = DevWrapper("pkg");

cli.presets.formats("cjs");
pkg.presets.formats("cjs", "esm");

cli.config.plugins.pop();
cli.config.output = cli.config.output.map((obj) => {
    obj["banner"] = "#!/usr/bin/env node"
    return obj;
})

function callback(scope) {
    return function (evt) {
        let that;
        scope == "cli" && (that = cli);
        scope == "pkg" && (that = pkg);
        if (evt.code == "ERROR") {
            console.error(evt);
            that.basic.hasErr = true;
            return;
        }
        if (evt.code == "END" && !that.hasErr) {
            console.clear();
            that.clearCache(__dirname + "/dist", __dirname + "/example");
            require("./example/index.js");
        } else {
            that.hasErr = false;
        }
    }
}

let auto = new QiAuto({
    "export": {
        directory: __dirname + "/source/core/configuration",
        module: "export"
    }
});

switch (command) {
    case "develop":
        auto["export"].watch();
        auto["export"].addEventListener("done", done);

        function done() {
            auto["export"].removeEventListener("done", done);
            cli.watch({
                callback(evt) {
                    if (evt.code == "ERROR") {
                        console.error(evt);
                    }
                }
            });
            // pkg.watch({
            //     callback: callback("pkg")
            // });
        }
        break;
    case "build":
        cli.build();
        pkg.build();
        break;
}