export default function createModel(model) {
  const { namespace, state: initialState, reducers, effects } = model;

  return {
    reducer: (state = initialState, action) => {
      const reducer = reducers[namespace + '/' + Object.keys(reducers).find(action.type)];
      if (reducer) {
        return reducer(state, action);
      }
      return state;
    },
    middleware: store => next => action => {
      next(action);
      const middleware = effects[namespace + '/' + Object.keys(effects).find(action.key)];
      middleware && middleware(
        store,
        action => {
          const { type, ...payload } = action;
          next({ type: namespace + '/' + type, ...payload})
        }
      );
    }
  }
}
