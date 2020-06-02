const files = require('../helpers/files'),
    path = require('path'),
    cliColor = require('cli-color'),
    ora = require('ora'),
    pascalCase = require('pascalcase'),
    camelCase = require('camelcase'),
    { paramCase } = require('param-case');

const spinner = ora();
const dirPath = files.getCurrentDirectoryBase();
const usesTypescript = checkIfTsConfigExists();

function checkIfTsConfigExists() {

    const checkIfFileExists = (dirPath) => {
        if (files.pathExists(path.resolve(dirPath, "package.json"))) {
            if (files.pathExists(path.resolve(dirPath, "tsconfig.json"))) return true;
            else return false;
        }
        else return null;
    };

    let currentDir = files.getCurrentDirectoryBase();
    const numberOfParents = currentDir.split(path.sep).length - 1;

    if (checkIfFileExists(currentDir) === true) return true;

    for (let i = numberOfParents; i >= 0; i--) {
        currentDir = path.resolve(currentDir, '../');

        const checkResult = checkIfFileExists(currentDir);

        if (checkResult !== null) return checkResult;
    }

    return false;
}

function createContainerFolder(name) {
    const componentPath = path.resolve(dirPath, `${paramCase(name)}`);

    files.createDirectory(componentPath);
    spinner.succeed('Folder creation was successful.');

    return componentPath;
}

function createStyleFile(name, componentPath) {
    files.writeFile(path.resolve(componentPath, `${camelCase(name)}.scss`), '/* Component level styles can be placed here */\n');
    spinner.succeed('Style file creation was successful.');
}

function getTemplateFile() {
    if (usesTypescript) {
        return require('../templates/default-ts.json');
    } else {
        return require('../templates/default.json');
    }
}

function createComponentFile(args, componentPath) {
    const templateFile = getTemplateFile();
    let template = '';

    if (String(args.type).toLowerCase() === 'class') {
        template = args.skipStyle ? templateFile.classTemplate : templateFile.styleClassTemplate;
    }
    else {
        template = args.skipStyle ? templateFile.functionTemplate : templateFile.styleFunctionTemplate;
    }

    let value = template;

    if (!args.skipStyle)
        value = template.replace(/\$\(1\)/g, camelCase(args.name));

    const updatedTemplate = value.replace(/\$\(0\)/g, pascalCase(args.name));

    files.writeFile(path.resolve(componentPath, `${camelCase(args.name)}.${usesTypescript ? 'tsx' : 'jsx'}`), updatedTemplate);

    spinner.succeed('Component file creation was successful.');
}

function execute(args) {
    let componentPath = dirPath;

    if (!args.skipContainer) {
        spinner.start('Creating container folder...');
        componentPath = createContainerFolder(args.name);
    }
    else spinner.warn('Skipped creating a container folder.');

    if (!args.skipStyle) {
        spinner.start('Creating style file...');

        createStyleFile(args.name, componentPath);
    }
    else spinner.warn('Skipped creating a style file.');

    spinner.start('Creating Component file...');
    createComponentFile(args, componentPath);

    console.log(cliColor.green(`Cuccessfully created component '${args.name}'.`));
}

module.exports = {
    bindGenerateCommand: (yargs) => {
        return yargs.command(['generate <name> [type] [skip-style] [skip-container]', 'g'], 'Creates a new component based on supplied options.', (yargs) => {
            yargs.positional('name', {
                describe: 'Name of new component in param case i.e name-of-component.',
                alias: 'n',
                type: 'string',
                demandOption: true
            }).positional('type', {
                describe: 'Type of component, whether "class" or "function".',
                alias: 't',
                type: 'string',
                choices: ['function', 'class'],
                default: 'function'
            }).positional('skip-style', {
                describe: 'Creates a component without it\'s own scss style.',
                alias: 'S',
                type: 'boolean',
                default: false
            }).positional('skip-container', {
                describe: 'Doesn\'t create a dedicated folder for the component.',
                alias: 'C',
                type: 'boolean',
                default: false
            })
        }, (args) => execute(args));
    }
}
