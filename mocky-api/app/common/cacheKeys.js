'use strict';

module.exports = {
  emailVerify(email, type) {
    return `emailVerify_${email}_${type}`;
  },
  user(id) {
    return 'user_' + id;
  },
  project(id) {
    return 'project_' + id;
  },
  projectByUser(user_id) {
    return 'project_by_user_' + user_id;
  },
  memberByProject(project_id) {
    return 'member_by_project_' + project_id;
  },
  group(id) {
    return 'group_' + id;
  },
  groupByProject(project_id) {
    return 'group_by_project_' + project_id;
  },
  interface(id) {
    return 'interface_' + id;
  },
  interfaceByProject(project_id) {
    return 'interface_by_project_' + project_id;
  },
  dataMap(id) {
    return 'dataMap_' + id;
  },
  dataMapByInterface(interface_id) {
    return 'dataMap_by_interface_' + interface_id;
  },
  mock(id) {
    return 'mock_' + id;
  },
  mockByInterface(interface_id) {
    return 'mock_by_interface_' + interface_id;
  },
};
