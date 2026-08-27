module.exports = {
  apps: [
    {
      name: "tech-support-nextjs",
      script: "npm",
      args: "start",
      cwd: "/home/ertel/app",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "tech-support-socket",
      script: "./node_modules/.bin/tsx",
      args: "server.js",
      cwd: "/home/ertel/app",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        SOCKET_PORT: 4001,
      },
    },
  ],
};
