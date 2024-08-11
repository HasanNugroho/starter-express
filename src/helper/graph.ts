import _ from 'lodash';
import { CustomError } from './errors';

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
    errorCode: err.statusCode,
    slug: err.status,
    message: err.message || 'An unexpected error occurred.',
  };
  return complete ? { responseResult: error } : error;
};
