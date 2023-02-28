const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

//setTokenCookie => login and signup routes
//This first function is setting the JWT cookie after a user is logged in or signed up.
//The payload of the JWT will be the return of the instance method .toSafeObject that you added previously to the User model.
//After the JWT is created, it's set to an HTTP-only cookie on the response as a token cookie.
// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const token = jwt.sign(
      { data: user.toSafeObject() },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    //It takes in the response and the session user and generates a JWT using the imported secret.
    res.cookie('token', token, {
    //It is set to expire in however many seconds you set on the JWT_EXPIRES_IN key in the .env file.
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
  };

  //restoreUser restores the session user based on the contents of the JWT cookie
  //and will be connected to the API router so that all API route handlers will check if there is a current user logged in or not.
  //This is a middleware function that will verify and parse the JWT's payload and search the database for a User with the id in the payload.
  const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    //If there is an error verifying the JWT or a User cannot be found with the id, then clear the token cookie from the response and set req.user to null.
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        //(This query should use the currentUser scope since the hashedPassword is not needed for this operation.)
        //If there is a User found, then save the user to a key of user onto the Request, req.user.
        req.user = await User.scope('currentUser').findByPk(id);
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
  };
  //The last authentication middleware to add is for requiring a session user to be authenticated before accessing a route.
  //Define this middleware as an array with the restoreUser middleware function you just created as the first element in the array.
  //This will ensure that if a valid JWT cookie exists, the session user will be loaded into the req.user attribute.
  //The second middleware will check req.user and will go to the next middleware if there is a session user present there.
  //If there is no session user, then an error will be created and passed along to the error-handling middlewares.
  const requireAuth = function (req, res, next) {
    if (req.user) return next();
    // // If there is no current user, return an error
    // const err = new Error('Unauthorized');
    // err.title = 'Unauthorized';
    // err.errors = ['Unauthorized'];
    // err.status = 401;
    // return next(err);
    return res.status(403).json({
      "message": "Forbidden",
      "statusCode": 403
    })
  };

  module.exports = { setTokenCookie, restoreUser, requireAuth };
