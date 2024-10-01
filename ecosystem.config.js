module.exports = {
    apps: [
        {
            name: 'ora-frontend',
            cwd: '/ora-frontend',
            script: 'npm start',
            error_file: './logs/service_gateway.err',
            exec_mode: 'cluster',
            instances: 'max',
            version: '0.9.1',
        }
    ]
}
