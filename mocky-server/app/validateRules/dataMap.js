'use strict';

module.exports = {
  basic: {
    interface_id: {
      type: 'integer',
    },
    project_id: {
      type: 'integer',
    },
    name: {
      type: 'string',
      max: 50,
    },
    from: {
      type: 'integer',
    },
  },
  noFrom: {
    mock_id: {
      type: 'string',
      max: 50,
    },
  },
  hasFrom: {
    match: {
      type: 'string',
      required: false,
      allowEmpty: true,
      max: 100,
    },
    regex: {
      type: 'integer',
    },
    mock_id: {
      type: 'string',
      max: 50,
      required: false,
      allowEmpty: true,
    },
  },
};
