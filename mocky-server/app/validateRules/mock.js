'use strict';

module.exports = {
  project_id: {
    type: 'integer',
  },
  interface_id: {
    type: 'integer',
  },
  name: {
    type: 'string',
    max: 100,
  },
  status_code: {
    type: 'integer',
  },
  mock_js: {
    type: 'boolean',
  },
  body: {
    type: 'string',
    max: 25000,
  },
};
