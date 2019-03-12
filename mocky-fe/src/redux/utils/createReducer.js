export default function createReducer(initialState, actionHandlerMap) {
  return (state = initialState, action) => {
    let handler = null;
    let type = action.type;
    if (type) {
      handler = actionHandlerMap[type];
    }
    if (handler) {
      return handler(state, action);
    }
    return state;
  };
}
