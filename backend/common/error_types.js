class BaseErrorType extends Error {
  constructor(statusCode, message) {
    super(statusCode, message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ObjectDoesNotExist extends BaseErrorType {
  constructor(statusCode, message) {
    super(statusCode, message);
    this.name = "ObjectDoesNotExist";
  }
}

class UnAuthorized extends BaseErrorType {
  constructor(statusCode, message) {
    super(statusCode, message);
    this.name = "UnAuthorized";
  }
}

class PermissionError extends BaseErrorType {
  constructor(statusCode, message) {
    super(statusCode, message);
    this.name = "PermissionError";
  }
}

class ValidationError extends BaseErrorType {
  //  errorData: [{ param: 'name', msg: 'Name is required' }]
  //  errorData is optional
  //  raise this error when you want to return a Validation error
  //  or throw error from express validator middleware
  constructor(statusCode, message, errorData) {
    super(statusCode, message);
    this.name = "ValidationError";
    this.errorData = errorData;
  }
}

class SubscriptionError extends BaseErrorType {
  constructor(statusCode, message) {
    super(statusCode, message);
    this.name = "SubscriptionError";
  }
}

class DuplicateEntry extends BaseErrorType {
  constructor(statusCode, message) {
    super(statusCode, message);
    this.name = "DuplicateEntry";
  }
}

class FileUploadError extends BaseErrorType {
  constructor(statusCode, message) {
    super(statusCode, message);
    this.name = "FileUploadError";
  }
}

module.exports = {
  ObjectDoesNotExist,
  UnAuthorized,
  PermissionError,
  ValidationError,
  SubscriptionError,
  DuplicateEntry,
  FileUploadError,
};
