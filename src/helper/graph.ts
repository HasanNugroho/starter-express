import _ from 'lodash';

export interface CustomError extends Error {
  code?: number;
}

export const generateSuccess = (msg: string) => {
  return {
    succeeded: true,
    errorCode: 0,
    slug: 'ok',
    message: _.defaultTo(msg, 'Operation succeeded.'),
  };
};

export const generateError = (err: CustomError, complete = true) => {
  const error = {
    succeeded: false,
    errorCode: _.isFinite(err.code) ? err.code : 1,
    slug: err.name,
    message: err.message || 'An unexpected error occurred.',
  };
  return complete ? { responseResult: error } : error;
};
