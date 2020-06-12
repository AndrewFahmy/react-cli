const { exec } = require('child_process'),
    files = require('../helpers/files'),
    path = require('path'),
    cliColor = require('cli-color'),
    ora = require('ora');

const spinner = ora();

const templatesUrl = 'https://github.com/AndrewFahmy/react-templates.git';

function validate(args) {
    if (path.resolve(files.getCurrentDirectoryBase()).toLowerCase()
        === path.resolve(__dirname).toLowerCase()) {
        throw cliColor.red("Can't create new project at npm's global cache folder, please select another path and try again.");
    }

    if (!args.name) {
        throw cliColor.red('Please provide a project name.');
    }
}

function tryCreateProjectDir(args) {
    const dirPath = path.resolve(files.getCurrentDirectoryBase(), args.name);

    if (!files.pathExists(dirPath)) {
        files.createDirectory(dirPath);

        spinner.succeed('Project folder creation was successful.');
    }
    else {
        spinner.fail();
        throw cliColor.red('A project with the same name already exists please chose another.');
    }
}

function updatePackageConfigFile(args) {
    const packageLocation = path.resolve(files.getCurrentDirectoryBase(), args.name, 'package.json');
    let package = files.getJsonContents(packageLocation);

    package.name = args.name;

    files.updateJsonFile(packageLocation, package);
}

function initializeNewGitRepo(dirPath, callback) {
    exec('git init', {
        cwd: dirPath
    }, (err) => {
        if (err) { spinner.fail(); throw err; }

        spinner.succeed('Git repo initialization was successful.');

        if (callback) callback();
    });
}

function installDependencies(dirPath, callback) {
    exec('npm i', {
        cwd: dirPath
    }, (err) => {
        if (err) { spinner.fail(); throw err; }

        spinner.succeed('dependencies installation was successful.');

        if (callback) callback();
    });
}

function cloneFiles(args, dirPath, callback) {
    const oldGitPath = path.resolve(dirPath, '.git');

    exec(`git clone ${templatesUrl} . -b ${args.template}`, {
        cwd: dirPath
    }, (err) => {
        if (err) { spinner.fail(); throw err; }

        files.deleteDirectory(oldGitPath);

        updatePackageConfigFile(args);

        spinner.succeed('Project files were downloaded successfully.')

        if (callback) callback();
    });
}

function handleInitializationAndInstallation(args, dirPath, callback) {
    if (!args.skipGit && !args.skipInstall) {
        spinner.start('Initializing Git repo...');

        initializeNewGitRepo(dirPath, () => {
            spinner.start('Installing dependencies...');

            installDependencies(dirPath, () => {
                if (callback) callback();
            });
        });
    }
    else {
        spinner.warn('Git repo initialization was skipped.');

        if (!args.skipInstall) {
            spinner.start('Installing dependencies...');

            installDependencies(dirPath, () => {
                if (callback) callback();
            });
        }
        else {
            spinner.warn('Dependencies installation was skipped.');

            if (callback) callback();
        }
    }
}

function execute(args) {
    validate(args);

    const dirPath = path.resolve(files.getCurrentDirectoryBase(), args.name);

    spinner.start('Creating project folder...');

    tryCreateProjectDir(args);

    spinner.start('Cloning project files...');

    cloneFiles(args, dirPath, () => {

        handleInitializationAndInstallation(args, dirPath, () => {
            spinner.succeed(cliColor.green('Project creation was successful.'));
        });
    });
}

module.exports = {
    bindCreateCommand: (yargs) => {
        return yargs.command(['create <name> [template] [skip-git] [skip-install]', 'c', 'n'], 'Creates a new applicaiton based on selected template.', (yargs) => {
            yargs.positional('name', {
                describe: 'Name of new project.',
                alias: 'n',
                type: 'string',
                demandOption: true
            }).positional('template', {
                describe: 'Template to be used for project, you can view all templates on the following link: '
                    + 'https://github.com/AndrewFahmy/react-templates/branches/all',
                alias: 't',
                type: 'string',
                default: 'ts-default'
            }).positional('skip-git', {
                desc: 'Skips creating a git repository for the new project.',
                alias: 'G',
                type: 'boolean',
                default: false
            }).positional('skip-install', {
                desc: 'Skips installing template dependencies using NPM.',
                alias: 'I',
                type: 'boolean',
                default: false
            })
        }, (args) => execute(args));
    }
}