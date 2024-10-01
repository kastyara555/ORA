module.exports = {
    apps: [
        {
            name: 'ora-frontend',
            script: 'npm run start',
            cwd: './ora-frontend',
            // args: '-p 4000',
            error_file: './logs/service_gateway.err',
            exec_mode: 'cluster',
            instances: 'max'
        }
    ]
}
