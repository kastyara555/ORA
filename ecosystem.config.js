module.exports = {
    apps: [
        {
            name: 'ora-frontend',
            script: './ora-frontend',
            // cwd: './ora-frontend',
            args: 'npm run start',
            error_file: './logs/service_gateway.err',
            exec_mode: 'cluster',
            instances: 'max',
            version: '0.9.1',
        }
    ]
}
