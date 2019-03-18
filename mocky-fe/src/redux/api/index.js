import { fetch } from '../../utils/fetch';

// action types
export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';

// action creators
export const apiRequest = ({ url, method, body, feature, success, error }) => ({
  type: `${feature}_${API_REQUEST}`,
  meta: { url, method, body, feature, success, error },
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
    const { body, url, method, feature, success, error } = action.meta;

    fetch(url, { body, method })
      .then(json => {
        dispatch(apiSuccess({ feature }));
        success && success(json.data);
      })
      .catch(errorMsg => {
        dispatch(apiError({ feature }));
        error && error(errorMsg);
      });
  }
};
