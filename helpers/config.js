const path = require('path'),
    files = require('./files');

const configPath = path.resolve(files.getCurrentDirectoryBase(), "rcli.json");
const appConfig = files.pathExists(configPath) ? require(configPath) : {};

function getNestedProperty(model, ...properties) {
    let value = model;

    for (const property of properties) {
        if (!value[property]) return null;

        value = value[property];
    }

    return value;
}

module.exports = {
    parseFileReplacements: (env) => {
        const fileReplacements = [];
        const replacements = getNestedProperty(appConfig,
            'configurations', env, 'fileReplacement');

        if (replacements) {
            for (const element of replacements) {
                const replaceRule = {
                    test: path.resolve(element.replace),
                    loader: require.resolve('file-replace-loader'),
                    options: {
                        replacement: path.resolve(element.with),
                        async: true
                    }
                }

                fileReplacements.push(replaceRule);
            }
        }

        return fileReplacements;
    }
};