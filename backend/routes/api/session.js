const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
//The check function from express-validator will be used with the handleValidationErrors to validate the body of a request.
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//validateLogin that will check these keys and validate them
const validateLogin = [
    //The validateLogin middleware is composed of the check and handleValidationErrors middleware.
    check('credential')
    //It checks to see whether or not req.body.credential and req.body.password are empty.
    //If one of them is empty, then an error will be returned as the response.
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("Email or username is required"),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
    handleValidationErrors
  ];

// Log in
router.post('/', validateLogin, async (req, res) => {
      const { credential, password } = req.body;
      const userInfo = await User.login({ credential, password });

      if (!userInfo) {
        res.status(401)
        return res.json({"message": "Invalid credentials",
        "statusCode": 401})
      }
      let user;
      const userToken = await setTokenCookie(res, userInfo);
      user = userInfo.toJSON();
      user.token = userToken
      return res.json({
        user
      });
    }
  );

// Log in
router.post(
    '/',
    async (req, res, next) => {
      const { credential, password } = req.body;
      //call the login static method from the User model.
      const user = await User.login({ credential, password });
    // If there is no user returned from the login static method, then create a "Login failed" error and invoke the next error-handling middleware with it.
      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }
      //If there is a user returned from the login static method, then call setTokenCookie and return a JSON response with the user information.
      await setTokenCookie(res, user);
      const { id, username, email, firstName, lastName, createdAt, updatedAt } = user
      return res.json({
        user: { id, username, email, firstName, lastName, createdAt, updatedAt }
      });
    }
  );

  // Log out route will remove the token cookie from the response and return a JSON success message.
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
      const { user } = req;
      //The GET /api/session get session user route will return the session user as JSON under the key of user .
      if (user) {
        return res.json({
          user: user.toSafeObject()
        });
        //If there is not a session, it will return a JSON with an empty object.
      } else return res.json({});
    }
  );

  router.get(
    '/',
    requireAuth,
    (req, res) => {
      const { user } = req;
      //The GET /api/session get session user route will return the session user as JSON under the key of user .
      if (user) {
        return res.json({
          user: user.toSafeObject()
        });
        //If there is not a session, it will return a JSON with an empty object.
      } else return res.json({});
    }
  );

module.exports = router;
