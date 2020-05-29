const webpack = require('webpack');

function execute(mode) {
    let config = null;

    if (String(mode).toLowerCase() === 'development') {
        config = require('../webpack.dev');
    }
    else {
        config = require('../webpack.prod')(mode);
    }

    const compiler = webpack(configuration);

    compiler.run();
}

module.exports = {
    bindBuildCommand(yargs) {
        return yargs.command('build [mode]', 'Build application files with specified configuration.', (yargs) => {
            yargs.positional('mode', {
                describe: 'Specify build mode (development, production, etc...).',
                alias: 'm',
                type: 'string',
                default: 'production'
            })
        }, ({ mode }) => execute(mode));
    }
}