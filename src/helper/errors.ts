import HTTP_STATUS from 'http-status-codes';

export interface IError {
  message: string;
  statusCode: number;
  status: string;
  data?: any; // Optional field for additional error data
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;
  protected defaultMessage: string = 'An error occurred'; // Provide a default value

  protected data?: any; // Optional field for additional error data

  constructor(message?: string, data?: any) {
    super(message || 'An error occurred'); // Use a default message if none provided
    this.name = this.constructor.name; // Set the name to the class name
    this.data = data;

    // Ensure the stack trace is properly set in Node.js environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
      data: this.data,
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';
  protected defaultMessage = 'Bad request';

  constructor(message?: string, data?: any) {
    super(message || 'Bad request', data); // Ensure the base class gets the proper message
  }
}

export class NotFoundException extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'error';
  protected defaultMessage = 'Resource not found';

  constructor(message?: string, data?: any) {
    super(message || 'Resource not found', data); // Ensure the base class gets the proper message
  }
}

export class NotAuthorized extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';
  protected defaultMessage = 'Not authorized';

  constructor(message?: string, data?: any) {
    super(message || 'Not authorized', data); // Ensure the base class gets the proper message
  }
}

export class FileTooLarge extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
  status = 'error';
  protected defaultMessage = 'File size exceeds limit';

  constructor(message?: string, data?: any) {
    super(message || 'File size exceeds limit', data); // Ensure the base class gets the proper message
  }
}

export class ServiceError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';
  protected defaultMessage = 'Service is unavailable';

  constructor(message?: string, data?: any) {
    super(message || 'Service is unavailable', data); // Ensure the base class gets the proper message
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  status = 'error';
  protected defaultMessage = 'Internal server error';

  constructor(message?: string, data?: any) {
    super(message || 'Internal server error', data); // Ensure the base class gets the proper message
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';
  protected defaultMessage = 'Request validation failed';

  constructor(message?: string, data?: any) {
    super(message || 'Request validation failed', data); // Ensure the base class gets the proper message
  }
}
