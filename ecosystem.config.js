module.exports = {
    apps: [
        {
            name: 'ora-frontend',
            cwd: '/ora-frontend',
            script: './build',
            args: 'start',
            error_file: './logs/service_gateway.err',
            exec_mode: 'cluster',
            instances: 4,
            max_memory_restart: '500M',
            version: '0.9.1',
        }
    ]
}
