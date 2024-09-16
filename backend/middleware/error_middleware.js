const mongoose = require("mongoose");
const { ValidationError } = require("../common/error_types");

function errorHandler(err, req, res, next) {
  res.status(err.statusCode || 500);
  const message = err.message || "Internal Server Error";
  const response = {
    success: false,
    message: message,
  };

  if (process.env.NODE_ENV === "development" && !err.statusCode) {
    // log error stack only if the error type is not defined
    console.log(err.stack);
  }

  if (err instanceof ValidationError) {
    const extractedErrors = [];
    if (err.errorData) {
      //  handle extra error data if provided
      err.errorData.forEach((field) => {
        extractedErrors.push({
          [field.param]: field.msg,
        });
      });
    } else {
      extractedErrors.push({ [err.name]: message });
    }
    response.error = extractedErrors;
    return res.json(response);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    // catch mongoose validation errors
    const extractedErrors = [];
    Object.keys(err.errors).map((field) => {
      extractedErrors.push({
        [field]: err.errors[field].message,
      });
    });
    res.status = 400;
    response.message = "Invalid data";
    response.error = extractedErrors;
    return res.json(response);
  }
  return res.json({
    ...response,
    error: [
      {
        [err.name]: message,
      },
    ],
  });
}

module.exports = { errorHandler };
