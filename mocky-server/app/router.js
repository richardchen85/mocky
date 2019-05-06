'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { home, user, project, group, interface: itface, mock, dataView, dataMap, mail, cache } = controller;

  router.get('/', home.index);

  // user
  router.post('/user/signUp', user.signUp);
  router.post('/user/login', user.login);
  router.get('/user/logout', user.logout);
  router.get('/user/get', user.getUser);
  router.get('/user/search', user.search);
  router.post('/user/resetPass', user.resetPass);
  router.get('/user/all', user.all);

  // project
  router.post('/project/save', project.save);
  router.get('/project/delete', project.delete);
  router.get('/project/getById', project.getById);
  router.get('/project/getByUser', project.getByUser);
  router.get('/project/detail', project.detail);
  router.post('/project/transfer', project.transfer);
  router.get('/project/all', project.all);

  // group
  router.post('/group/save', group.save);
  router.get('/group/delete', group.delete);
  router.get('/group/detail', group.detail);
  router.post('/group/sort', group.sort);

  // interface
  router.post('/interface/save', itface.save);
  router.get('/interface/delete', itface.delete);
  router.get('/interface/detail', itface.detail);
  router.post('/interface/sort', itface.sort);

  // dataView
  // /dataView/[project_id]/[mock.url]
  router.all(/\/dataView\/(\d+)\/(.*)/, dataView.view);

  // mock
  router.post('/mock/save', mock.save);
  router.get('/mock/delete', mock.delete);
  router.get('/mock/detail', mock.detail);
  router.get('/mock/list', mock.list);

  // dataMap
  router.post('/dataMap/save', dataMap.save);
  router.get('/dataMap/delete', dataMap.delete);
  router.get('/dataMap/detail', dataMap.detail);
  router.get('/dataMap/list', dataMap.list);

  // mail
  router.post('/mail/sendMail', mail.sendMail);

  // redis
  router.get('/cache/keys', cache.keys);
  router.get('/cache/get', cache.get);
  router.post('/cache/del', cache.del);
  router.post('/cache/set', cache.set);
};
