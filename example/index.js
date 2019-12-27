import fs from "fs";
import PackageHelper from "../dist/pkg/index.js";

(async () => {
    var source = JSON.parse(fs.readFileSync(__dirname + "/package.json").toString());
    let result = await PackageHelper.guide([], source);
    console.log(source);
    // fs.writeFileSync(__dirname + "/package.json", PackageHelper.format(source));
})();