'use strict';

module.exports = appInfo => {
  const config = {};

  config.appId = '13256';
  config.name = 'mocky-server';
  config.appDomain = 'mocky.chenliqiang.cn';

  config.description = 'mocky server side project';

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '3344_1234';

  config.proxy = true;

  // add your config here
  config.middleware = [ 'errorPage', 'userAuth', 'userRequired' ];

  // userAuth middleware configuration
  config.auth_cookie_name = 'uid_dev';
  config.userAuth = {
    cookie_key: config.auth_cookie_name,
    excludes: [ /^\/dataView/ ],
    adminUsers: [ 1 ],
  };
  // userRequired middleware configuration
  config.userRequired = {
    includes: [
      /^\/(user|project|group|interface|mock|erp)/,
    ],
    excludes: [ '/user/signUp', '/user/login' ],
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

  return config;
};
