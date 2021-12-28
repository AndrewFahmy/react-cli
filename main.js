#!/usr/bin/env node

const cliColor = require('cli-color'),
    figlet = require('figlet'),
    clear = require('clear'),
    yargs = require('yargs'),
    createCommand = require('./commands/create'),
    generateCommand = require('./commands/generate');


clear();

console.log(
    cliColor.white(
        figlet.textSync('React CLI', { horizontalLayout: "full" })));

let arguments = yargs.usage('rcli <command> [parameter(s)]');

arguments = createCommand.bindCreateCommand(arguments);
arguments = generateCommand.bindGenerateCommand(arguments);

arguments.scriptName('')
    .version('2.0.8')
    .help()
    .alias('h', 'help')
    .alias('v', 'version').argv;