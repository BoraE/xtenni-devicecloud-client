// pm2 start ecosystem.config.js # uses variables from env
// pm2 start ecosystem.config.js --env production # uses variables from env_production

module.exports = {
  apps : [{
    name: 'xtenni-devicecloud-client',
    script: './app.js',
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development'
    },
    env_staging: {
      NODE_ENV: 'staging'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    staging: {
      user: "beryilma",
      host: "boron",
      repo: "git@github.com:BoraE/xtenni-devicecloud-client.git",
      ref: "origin/master",
      path: "/home/beryilma/Sandbox/Picotek/xtenni-devicecloud-client",
      "post-deploy" : "npm set audit false && npm install && pm2 startOrRestart ecosystem.config.js --env staging"
    },
    production: {
      user: "ubuntu",
      host: "xtenni",
      repo: "git@github.com:BoraE/xtenni-devicecloud-client.git",
      ref: "origin/master",
      path: "/home/ubuntu/Sandbox/Picotek/xtenni-devicecloud-client",
      "post-deploy" : "npm set audit false && npm install && pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
};
