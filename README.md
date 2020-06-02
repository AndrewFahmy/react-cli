# React-CLI
Simple CLI for building react applications.

## Usage

Install the package globaly from NPM and then you can use it as below:

    npm i @react/cli

Main help section.

    rcli <command> [parameter(s)]

    Commands:
    create <name> [template] [skip-git]       Creates a new applicaiton based on
        [skip-install]                            selected template.   [aliases: c, n]
    generate <name> [type] [skip-style]       Creates a new component based on
        [skip-container]                          supplied options.       [aliases: g]

    Options:
    -h, --help     Show help                                             
    -v, --version  Show version number                                   


## Create New Project Command
You can create a new project (base on one of the [templates](https://github.com/AndrewFahmy/react-templates/branches/all)) with the `create` command.

    create <name> [template] [skip-git] [skip-install]
    Creates a new applicaiton based on selected template.

    Parameters:
    name, n          Name of new project.                      [string] [required]
    template, t      Template to be used for project, you can view all templates
                     on the following link:
                     https://github.com/AndrewFahmy/react-templates/branches/all
                                        [string] [default: "default-typescript"]
    skip-git, G      Skips creating a git repository for the new project.
                                                      [boolean] [default: false]
    skip-install, I  Skips installing template dependencies using NPM.
                                                      [boolean] [default: false]


## Generate New Component
You can generate a new component, `class` or `function` components are supported.

    generate <name> [type] [skip-style] [skip-container]
    Creates a new component based on supplied options.

    Parameters:
    name, n            Name of new component in param case i.e name-of-component.
                                                             [string] [required]
    type, t            Type of component, whether "class" or "function".
                        [string] [choices: "function", "class"] [default: "function"]
    skip-style, S      Creates a component without it's own scss style.
                                                      [boolean] [default: false]
    skip-container, C  Doesn't create a dedicated folder for the component.
                                                      [boolean] [default: false]
