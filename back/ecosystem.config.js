module.exports = {
  apps: [{
    name: 'dogether-backend',
    script: 'src/index.js',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // 개발 환경 설정
    watch: true,
    ignore_watch: ['node_modules', 'logs'],
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}; 