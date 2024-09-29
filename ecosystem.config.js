module.exports = {
    apps: [
        {
            name: 'ora-frontend',
            script: 'npm run start',
            args: '-p 4000',
            exec_mode: 'cluster',
            instances: 'max'
        }
    ]
}
