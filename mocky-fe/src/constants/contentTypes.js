const types = [
  {
    key: 1,
    name: 'json',
    content: 'application/json; charset=utf-8',
  },
  {
    key: 2,
    name: 'text',
    content: 'text/plain; charset=utf-8',
  },
];

export default {
  types,
  getByKey(key) {
    return types.filter(type => type.key === key)[0];
  },
};
