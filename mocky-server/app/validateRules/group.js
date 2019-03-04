'use strict';

module.exports = {
  project_id: {
    type: 'integer',
  },
  name: {
    type: 'string',
    max: 20,
  },
  desc: {
    type: 'string',
    max: 50,
    required: false,
    allowEmpty: true,
  },
};
