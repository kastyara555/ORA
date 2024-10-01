module.exports = {
    apps: [
        {
            name: 'ora-frontend',
            script: 'node_modules/next/dist/bin/next',
            args: 'start',
            error_file: './logs/service_gateway.err',
            exec_mode: 'cluster',
            instances: 4,
            // max_memory_restart: '500M',
            // version: '0.9.1',
        }
    ]
}
