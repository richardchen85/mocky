export default function createModel(model) {
  const { namespace, state: initialState, reducers, effects } = model;

  return {
    reducer: (state = initialState, action) => {
      const type = Object.keys(reducers).find(key => namespace + '/' + key === action.type);

      if (type) {
        return reducers[type](state, action);
      }
      return state;
    },
    middleware: store => next => action => {
      next(action);

      const type = Object.keys(effects).find(key => namespace + '/' + key === action.type);
      if (type) {
        effects[type](store, next, action);
      }
    },
  };
}
