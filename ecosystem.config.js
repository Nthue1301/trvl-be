//Doc: https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
    apps : [{
      name   : "trvl",
      script : "./server.js",
      max_memory_restart: '500M',
      exec_mode: "cluster",
      instances: 2, //4 workers
      watch: true,
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
          NODE_ENV: "development"
      }
    }]
  }
  