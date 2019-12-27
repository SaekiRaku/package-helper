import locale from "os-locale";
import i18N from "@qiqi1996/qi-i18n-node";

import translation_initial from "./translation_initial.js";
import translation_config from "./translation_config.js";
import translation_cli from "./translation_cli.js";

const SYSTEM_LANGUAGE = locale.sync()

function make(t) {
    var scope = new i18N();

    if (SYSTEM_LANGUAGE == "zh-CN") {
        scope.config.use("zh-CN")
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
}

export default result;