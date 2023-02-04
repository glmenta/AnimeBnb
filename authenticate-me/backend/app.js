const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { ValidationError } = require('sequelize');
//isProduction that will be true if the environment is in production or not by checking the environment key in the configuration file (backend/config/index.js)
const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
//Connect the morgan middleware for logging information about requests and responses
app.use(morgan('dev'));

//the cookie-parser middleware for parsing cookies and the express.json middleware for parsing JSON bodies of requests with Content-Type of "application/json"
app.use(cookieParser());
app.use(express.json());

//Only allow CORS (Cross-Origin Resource Sharing) in development using the cors middleware because the React frontend will be served from a different server than the Express server.
//CORS isn't needed in production since all of our React and Express resources will come from the same origin.

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

//Enable better overall security with the helmet middleware
//Add the crossOriginResourcePolicy to the helmet middleware with a policy of cross-origin. This will allow images with URLs to render in deployment.
app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );
//Add the csurf middleware and configure it to use cookies
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );
//The csurf middleware will add a _csrf cookie that is HTTP-only (can't be read by JavaScript) to any server response.
//It also adds a method on all requests (req.csrfToken) that will be set to another cookie (XSRF-TOKEN) later on.
//These two cookies work together to provide CSRF (Cross-Site Request Forgery) protection for your application.
//The XSRF-TOKEN cookie value needs to be sent in the header of any request with all HTTP verbs besides GET.
//This header will be used to validate the _csrf cookie to confirm that the request comes from your site and not an unauthorized site.

const routes = require('./routes');

app.use(routes); // Connect all the routes

//The first error handler is actually just a regular middleware. It will catch any requests that don't match any of the routes defined and create a server error with a status code of 404.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  //If this resource-not-found middleware is called, an error will be created with the message "The requested resource couldn't be found."
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  //and a status code of 404.
  next(err);
  //Afterwards, next will be invoked with the error. Remember, next invoked with nothing means that error handlers defined after this middleware will not be invoked.
  //However, next invoked with an error means that error handlers defined after this middleware will be invoked.
});

//The second error handler is for catching Sequelize errors and formatting them before sending the error response.
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
  //If the error that caused this error-handler to be called is an instance of ValidationError from the sequelize package,
    err.errors = err.errors.map((e) => e.message);
  //then the error was created from a Sequelize database validation error and the additional keys of title string
    err.title = 'Validation error';
  }
  //and errors array will be added to the error and passed into the next error handling middleware.
  next(err);
});

//The last error handler is for formatting all the errors before returning a JSON response.
//It will include the error message, the errors array, and the error stack trace (if the environment is in development) with the status code of the error message.
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;
