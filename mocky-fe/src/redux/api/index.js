import { fetch } from '../../utils/fetch';

// action types
export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';

// action creators
export const apiRequest = ({ feature, ...rest }) => ({
  type: `${feature}_${API_REQUEST}`,
  meta: { feature, ...rest },
});

export const apiSuccess = ({ feature }) => ({
  type: `${feature}_${API_SUCCESS}`,
});

export const apiError = ({ feature }) => ({
  type: `${feature}_${API_ERROR}`,
});

// middleware
export const apiMiddleware = ({ dispatch }) => next => action => {
  next(action);

  if (action.type.includes(API_REQUEST)) {
    const { url, feature, success, error: errorCallback, ...rest } = action.meta;

    fetch(url, { ...rest })
      .then(json => {
        dispatch(apiSuccess({ feature }));
        success && success(json.data);
      })
      .catch(error => {
        dispatch(apiError({ feature }));
        errorCallback && errorCallback(error.message);
      });
  }
};
