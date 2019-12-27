import core from "../core/index.js";
import i18N from "../core/i18n/index.js";

export default class PackageHelper {
    /**
     * Set the output language of PackageHelper.
     * @param {String} language - For example: "zh-CN", default is "en".
     */
    static locale(language) {
        i18N.use(language);
    }

    static format(json) {
        return core.format(json);
    }
    
    static async guide(list=[], source={}) {
        let l;
        if (Array.isArray(list) && list.length) {
            l = list;
        } else {
            l = await core.initial();
        }

        return await core.config(l, source);
    }
}