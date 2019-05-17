'use strict';

module.exports = appInfo => {
  const config = {};

  config.appId = '13256';
  config.name = 'mocky-api';
  config.appDomain = 'api.mocky.chenliqiang.cn';

  config.description = 'mocky api project';

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '3344_1234';

  config.proxy = true;

  // add your config here
  config.middleware = ['errorPage', 'userAuth', 'userRequired', 'adminRequired'];

  // userAuth middleware configuration
  config.auth_cookie_name = 'uid_dev';
  config.userAuth = {
    cookie_key: config.auth_cookie_name,
    excludes: [/^\/dataView/],
    adminUsers: [1],
  };

  // userRequired middleware configuration
  config.userRequired = {
    includes: [/^\/(user|project|group|interface|mock|erp|redis)/],
    excludes: ['/user/signUp', '/user/login', '/user/resetPass'],
  };

  // admin required
  config.adminRequired = {
    includes: ['/redis', '/project/all', '/user/all', '/user/changeStatus'],
  };

  // static
  config.static = {
    prefix: '/misc',
  };

  // security
  config.security = {
    csrf: {
      enable: false,
    },
    xframe: {
      enable: false,
    },
  };

  // view config
  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.nj',
    mapping: {
      '.nj': 'nunjucks',
    },
  };

  config.bodyParser = {
    jsonLimit: '800kb',
  };

  // mysql
  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '',
      database: 'mocky',
      dateStrings: true,
    },
  };

  // redis
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      keyPrefix: 'mocky_',
      db: 0,
    },
  };

  // smtp mail config
  config.mail = {
    from: '"mocky" <clq_web@126.com>',
    host: 'smtp.126.com',
    port: 587,
    secure: true,
    auth: {
      user: '',
      pass: '',
    },
  };

  return config;
};
