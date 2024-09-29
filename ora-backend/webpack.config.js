const path = require('path');

module.exports = {
    mode: 'production',
    entry: './bin/www',
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: 'production.js',
    },
    target: 'node',
    externals: ['pg-hstore'],
};
