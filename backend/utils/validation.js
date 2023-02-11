const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
//define an Express middleware called handleValidationErrors
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
//that will call validationResult from the express-validator package passing in the request.
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);
//f there are validation errors, create an error with all the validation error messages and invoke the next error-handling middleware.
    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  //If there are no validation errors returned from the validationResult function, invoke the next middleware.
  next();
};

module.exports = {
  handleValidationErrors
};