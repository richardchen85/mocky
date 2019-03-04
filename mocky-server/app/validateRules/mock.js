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
  body: {
    type: 'string',
    max: 25000,
  },
};
