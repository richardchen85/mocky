'use strict';

const helper = require('../../../app/extend/helper');

describe('/test/app/extend/helper.test.js', () => {
  it('cutString', () => {
    const len = 5;
    const content = '303904329854325403504325432';
    const result = helper.cutString(content, len);
    assert(result.length === (content / len) || result.length === (content / len) + 1);
  });
});
