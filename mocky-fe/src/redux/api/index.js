import { fetch } from '../../utils/fetch';

// action types
export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';

// action creators
export const apiRequest = ({url, method, body, feature}) => ({
  type: `${feature}_${API_REQUEST}`,
  payload: body,
  meta: {method, url, feature}
});

export const apiSuccess = ({data, feature}) => ({
  type: `${feature}_${API_SUCCESS}`,
  payload: data,
  meta: {feature}
});

export const apiError = ({error, feature}) => ({
  type: `${feature}_${API_ERROR}`,
  payload: error,
  meta: {feature}
});


// middleware
export const apiMiddleware = ({dispatch}) => (next) => (action) => {
  next(action);

  if (action.type.includes(API_REQUEST)) {
    const {body, url, method, feature} = action.meta;

    fetch(url, {body, method})
      .then(json => dispatch(apiSuccess({data: json.data, feature})))
      .catch(error => dispatch(apiError({error: error, feature})))
  }
};
