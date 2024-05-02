import { HttpException, HttpStatus } from '@nestjs/common';

type ExceptionObject = {
  code: string;
  statusCode: number;
  timestamp: string;
  message?: string;
};

/**
 * Exception class that extends HttpException from NestJS.
 * This class is used to throw standard exceptions with additional details.
 * @extends {HttpException}
 */
export class Exception extends HttpException {
  /**
   * @param {string} internalCode - The internal application code for the exception.
   * @param {any} [message] - The message for the exception.
   * @param {HttpStatus} [statusCode] - The HTTP status code for the exception.
   * @param {any} [reason] - The reason for the exception.
   */
  constructor(
    internalCode: string,
    statusCode: HttpStatus,
    message?: any,
    reason?: any,
  ) {
    const errorObject: ExceptionObject = {
      code: internalCode,
      statusCode,
      timestamp: new Date().toISOString(),
    };
    if (message) errorObject['message'] = message;
    super(errorObject, statusCode, reason);
  }
}

/**
 * Enum representing the reasons for generic exceptions.
 */
export enum GenericExceptionReason {
  // Auth
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  // Mongoose
  VALUE_ALREADY_EXISTS = 'VALUE_ALREADY_EXISTS',
  // Shared
  MISSING_OR_INVALID_DATA = 'MISSING_OR_INVALID_DATA',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

/**
 * Represents a mapping of generic exception reasons to HTTP status codes.
 */
export const GenericStatusResolver: Record<GenericExceptionReason, HttpStatus> =
  {
    // Auth
    [GenericExceptionReason.AUTH_UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
    // Mongoose
    [GenericExceptionReason.VALUE_ALREADY_EXISTS]: HttpStatus.CONFLICT,
    // Shared
    [GenericExceptionReason.MISSING_OR_INVALID_DATA]: HttpStatus.BAD_REQUEST,
    [GenericExceptionReason.RESOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [GenericExceptionReason.RESOURCE_CONFLICT]: HttpStatus.CONFLICT,
    [GenericExceptionReason.UNEXPECTED_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  };
