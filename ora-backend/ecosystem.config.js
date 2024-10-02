module.exports = {
    apps: [
        {
            name: 'ora-backend',
            script: 'build/production.js',
            error_file: './logs/service_gateway.err',
            exec_mode: 'cluster',
            instances: 2,
            // max_memory_restart: '500M',
        }
    ]
}
