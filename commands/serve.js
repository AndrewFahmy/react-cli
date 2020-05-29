const webpack = require('webpack'),
    wepackDevServer = require('webpack-dev-server'),
    webpackConfigurtion = require('../webpack.dev');

function execute(args) {
    const compiler = webpack(webpackConfigurtion);

    const server = new wepackDevServer(compiler, { open: args.view });

    server.listen(args.port, (err) => {
        if (err)
            console.error(err);

        console.log('server listening at localhost:', args.port);
    });
}

module.exports = {
    bindServeCommand: (yargs) => {
        return yargs.command('serve [open] [port]', 'Start dev server for a react application.', (yargs) => {
            yargs.positional('open', {
                describe: 'Opens the default web browser to view the application.',
                alias: 'o',
                type: 'boolean',
                default: false
            }).positional('port', {
                describe: 'Port used to serve the application.',
                alias: 'p',
                type: 'number',
                default: 3000
            })
        }, ({ port, open }) => execute({ port, view: open }));
    }
};