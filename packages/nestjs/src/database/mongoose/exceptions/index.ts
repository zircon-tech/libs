import { MongooseError, Error } from 'mongoose';
import { MongoServerError } from 'mongodb';
import {
  Exception,
  GenericExceptionReason,
  GenericStatusResolver,
} from '../../../exceptions/exception';

export function handleMongooseError(error: MongooseError): never {
  if (error instanceof Error.ValidationError) {
    const errors = [];
    for (const field in error.errors) {
      errors.push(error.errors[field].message);
    }
    throw new Exception(
      GenericExceptionReason.MISSING_OR_INVALID_DATA,
      GenericStatusResolver[GenericExceptionReason.MISSING_OR_INVALID_DATA],
      `Invalid object values: ${error.message} - ${errors.join(', ')}`,
    );
  }

  if (error.name == 'MongoServerError') {
    const mongoError = error as MongoServerError;
    if (mongoError.code == 11000) {
      throw new Exception(
        GenericExceptionReason.VALUE_ALREADY_EXISTS,
        GenericStatusResolver[GenericExceptionReason.VALUE_ALREADY_EXISTS],
        error.message,
      );
    }
  }
  throw error;
}
