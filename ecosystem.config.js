module.exports = {
    apps: [
        {
            name: 'ora-frontend',
            script: 'ora-frontend/node_modules/next/dist/bin/next',
            args: 'start',
            error_file: './logs/service_gateway.err',
            exec_mode: 'cluster',
            instances: 'max',
            version: '0.9.1',
        }
    ]
}
