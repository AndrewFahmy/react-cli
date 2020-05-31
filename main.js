#!/usr/bin/env node
const cliColor = require('cli-color'),
    figlet = require('figlet'),
    clear = require('clear'),
    yargs = require('yargs'),
    serveCommand = require('./commands/serve'),
    buildCommand = require('./commands/build'),
    createCommand = require('./commands/create');


clear();

console.log(
    cliColor.white(
        figlet.textSync('React CLI', { horizontalLayout: "full" })));

let arguments = yargs.usage('rcli <command> [parameter(s)]');

arguments = createCommand.bindCreateCommand(arguments);
arguments = serveCommand.bindServeCommand(arguments);
arguments = buildCommand.bindBuildCommand(arguments);

arguments.scriptName('')
    .version('1.0.6')
    .help()
    .alias('h', 'help')
    .alias('v', 'version').argv;