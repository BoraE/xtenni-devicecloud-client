// pm2 start ecosystem.config.js # uses variables from env
// pm2 start ecosystem.config.js --env production # uses variables from env_production

module.exports = {
  apps : [{
    name: 'app_client',
    script: './app.js',
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
