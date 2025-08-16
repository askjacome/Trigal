module.exports = {
  apps: [{
    name: 'trigal-crm',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    error_file: '/var/log/trigal-crm/err.log',
    out_file: '/var/log/trigal-crm/out.log',
    log_file: '/var/log/trigal-crm/combined.log',
    time: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
