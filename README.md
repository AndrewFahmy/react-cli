# React-CLI
Simple CLI for building react applications.

## Usage

Install the package globaly from NPM and then you can use it as below:

    npm i @react/cli

Main help section.

    rcli <command> [parameter(s)]

    Commands:
    new <name> [template] [skipGit]  Creates a new applicaiton based on selected 
                                     template.

    serve [open] [port]              Start dev server for a react application.

    build [mode]                     Build application files with specified
                                     configuration.

    Options:
    -h, --help     Show help
    -v, --version  Show version number


## Create New Project Command
You can create a new project (base on one of the [templates](https://github.com/AndrewFahmy/react-templates/branches/all)) with the `new` command.

    rcli new <name> [template] [skipGit]
    Creates a new applicaiton based on selected template.

    Parameters:
    name, n      Name of new project.                          [string] [required]
    template, t  Template to be used for project     [string] [default: "default"]
    skipGit, s   Skips creating a git repository for the new project.
                                                      [boolean] [default: false]


## Start a dev server
You can start a dev server by using the `serve` command.

    rcli serve [open] [port]
    Start dev server for a react application.

    Parameters:
    open, o  Opens the default web browser to view the application.
                                                      [boolean] [default: false]
    port, p  Port used to serve the application.        [number] [default: 3000]


## Create a production build
You can create a build for production using the `build` command.

    rcli build [mode]
    Build application files with specified configuration.

    Parameters:
     mode, m  Specify build mode (development, production, etc...).
                                                [string] [default: "production"]