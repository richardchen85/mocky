const froms = [{ key: 0, name: '无' }, { key: 1, name: 'path' }, { key: 2, name: 'query' }, { key: 3, name: 'body' }];

export default {
  froms,
  getByKey(key) {
    return froms.find(e => e.key === key);
  },
};
