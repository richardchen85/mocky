'use strict';

const contentTypes = require('../common/contentTypes');

module.exports = {
  group_id: {
    type: 'integer',
  },
  project_id: {
    type: 'integer',
  },
  name: {
    type: 'string',
    max: 50,
  },
  url: {
    type: 'string',
    required: false,
    allowEmpty: true,
    max: 500,
  },
  method: {
    type: 'string',
  },
  content_type: {
    type: 'enum',
    values: contentTypes.types.map(type => type.key),
  },
  jsonp_callback: {
    type: 'string',
    required: false,
    allowEmpty: true,
    max: 50,
  },
  desc: {
    type: 'string',
    required: false,
    allowEmpty: true,
    max: 100,
  },
};
