'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { home, user, project, group, interface: itface, mock, dataView, dataMap } = controller;

  router.get('/', home.index);

  // user
  router.post('/user/signUp', user.signUp);
  router.post('/user/login', user.login);
  router.get('/user/logout', user.logout);
  router.get('/user/get', user.getUser);
  router.get('/user/search', user.search);

  // project
  router.post('/project/save', project.save);
  router.get('/project/delete', project.delete);
  router.get('/project/getById', project.getById);
  router.get('/project/getByUser', project.getByUser);
  router.get('/project/detail', project.detail);

  // group
  router.post('/group/create', group.create);
  router.get('/group/remove', group.remove);
  router.post('/group/update', group.update);
  router.get('/group/detail', group.detail);
  router.post('/group/sort', group.sort);

  // interface
  router.post('/interface/create', itface.create);
  router.get('/interface/remove', itface.remove);
  router.post('/interface/update', itface.update);
  router.get('/interface/detail', itface.detail);
  router.post('/interface/sort', itface.sort);

  // dataView
  // /dataView/[project_id]/[mock.url]
  router.all(/\/dataView\/(\d+)\/(.*)/, dataView.view);

  // mock
  router.post('/mock/create', mock.create);
  router.get('/mock/remove', mock.remove);
  router.post('/mock/update', mock.update);
  router.get('/mock/detail', mock.detail);
  router.get('/mock/list', mock.list);

  // dataMap
  router.post('/dataMap/create', dataMap.create);
  router.get('/dataMap/remove', dataMap.remove);
  router.post('/dataMap/update', dataMap.update);
  router.get('/dataMap/detail', dataMap.detail);
  router.get('/dataMap/list', dataMap.list);
};
