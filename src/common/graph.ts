import _ from 'lodash';
import { CustomError } from './errors';

export const generateSuccess = (msg: string, data?: any[] | any) => {
  return {
    statusCode: 200,
    message: _.defaultTo(msg, 'Operation succeeded.'),
    data: data ?? null
  };
};

export const generateError = (err: CustomError, complete = true) => {
  const error = {
    statusCode: err.statusCode,
    message: err.message || 'An unexpected error occurred.',
    detail: err.data
  };
  return complete ? { responseResult: error } : error;
};
