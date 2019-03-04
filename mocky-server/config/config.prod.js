'use strict';

module.exports = () => {
  const config = {};

  config.auth_cookie_name = 'uid';

  config.logger = {
    dir: '/home/clq/logs/mocky.chenliqiang.cn',
  };

  config.customLogger = {
    scheduleLogger: {
      consoleLevel: 'NONE',
      file: config.logger.dir + '/egg-schedule.log',
    },
  };

  // security
  config.security = {
    csrf: {
      queryName: 'token',
      bodyName: 'token',
      ignore: /^dataView/,
    },
    xframe: {
      ignore: /^dataView/,
    },
  };

  config.userAuth = {
    cookie_key: config.auth_cookie_name,
    adminUsers: [ 1 ],
  };

  // mysql
  config.mysql = {
    client: {
      host: process.env.mysql_host || 'localhost',
      port: process.env.mysql_port || 3306,
      user: process.env.mysql_user || 'root',
      password: process.env.mysql_password || '',
      database: process.env.mysql_database || '',
      dateStrings: true,
    },
  };

  return config;
};
