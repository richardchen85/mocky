'use strict';

module.exports = {
  name: {
    type: 'string',
    max: 50,
  },
  desc: {
    type: 'string',
    max: 100,
    required: false,
    allowEmpty: true,
  },
  members: {
    type: 'array',
    max: 1000,
    required: false,
    allowEmpty: true,
  },
};
