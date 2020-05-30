const { exec } = require('child_process'),
    files = require('../helpers/files'),
    path = require('path'),
    cliColor = require('cli-color');

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
    }
    else throw cliColor.red('A project with the same name already exists please chose another.');
}

function updatePackageConfigFile(args) {
    const packageLocation = path.resolve(files.getCurrentDirectoryBase(), args.name, 'package.json');
    let package = files.getJsonContents(packageLocation);

    package.name = args.name;

    files.updateJsonFile(packageLocation, package);
}

function initializeNewGitRepo(dirPath) {
    exec('git init', {
        cwd: dirPath
    }, (err) => {
        if (err) throw err;

        console.log(cliColor.green('Project creation was successful.'));
    });
}

function cloneFiles(args, dirPath) {
    const oldGitPath = path.resolve(files.getCurrentDirectoryBase(), args.name, '.git');

    exec(`git clone ${templatesUrl} . -b ${args.template}`, {
        cwd: dirPath
    }, (err) => {
        if (err) throw err;

        files.deleteDirectory(oldGitPath);

        updatePackageConfigFile(args);
    });
}

function execute(args) {
    validate(args);

    const dirPath = path.resolve(files.getCurrentDirectoryBase(), args.name);

    console.log('Creating project folder...');

    tryCreateProjectDir(args);

    console.log('Cloning project files...');

    cloneFiles(args, dirPath);

    if (!args.skipGit) {
        console.log('Initializing Git repo...');

        initializeNewGitRepo(dirPath);
    }
    else {
        console.log(cliColor.yellow('Git repo initialization was skipped.'));
        console.log(cliColor.green('Project creation was successful.'));
    }
}

module.exports = {
    bindCreateCommand: (yargs) => {
        return yargs.command('new <name> [template] [skipGit]', 'Creates a new applicaiton based on selected template.', (yargs) => {
            yargs.positional('name', {
                describe: 'Name of new project.',
                alias: 'n',
                type: 'string',
                demandOption: true
            }).positional('template', {
                describe: 'Template to be used for project, you can view all templates on the following link (they are the repo branches): '
                    + 'https://github.com/AndrewFahmy/react-templates/branches/all',
                alias: 't',
                type: 'string',
                default: 'default'
            }).positional('skipGit', {
                desc: 'Skips creating a git repository for the new project.',
                alias: 's',
                type: 'boolean',
                default: false
            })
        }, ({ name, template, skipGit }) => execute({ name, template, skipGit }));
    }
}