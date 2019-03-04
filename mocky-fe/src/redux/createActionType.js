export default function createActionTypes(actionTypes = [], prefix = '') {
  const result = {};
  actionTypes.forEach(function(actionType) {
    result[actionType] = prefix + actionType;
  });
  return result;
}