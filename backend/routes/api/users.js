const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const { token } = require('morgan')


//The validateSignup middleware is composed of the check and handleValidationErrors middleware.
const validateSignup = [
    check('email')
    //It checks to see if req.body.email exists and is an email,
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last name is required'),
    check('username')
    //req.body.username is a minimum length of 4 and is not an email,
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.')
      .not()
      .isEmpty()
      .withMessage('Please provide a valid username')
      .custom(async (value, { req }) => {
        const existingUser = await User.findOne({ username: value });
        if (existingUser) {
          throw new Error('Username already exists. Please choose a different username.');
        }
        return true;
      }),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
    //and req.body.password is not empty and has a minimum length of 6.
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    //If at least one of the req.body values fail the check, an error will be returned as the response.
    handleValidationErrors
  ];

const router = express.Router();
// Sign up
router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const emailCheck = await User.findOne({
      where: {email: email}
    })
    const usernameCheck = await User.findOne({
      where: {username: username}
    })
    if(emailCheck) { //Validation check if a user with the specified email exists
      const err = new Error("User already exists")
      err.status = 403
      return res.json({
        message: err.message,
        statusCode: err.status,
        errors: {
          email: "User with that email already exists"
        }
      })
    }
    if (usernameCheck){ //Validation check if a user has a duplicated username
      const err = new Error("User already exists")
      err.status = 403;
      return res.json({
        message: err.message,
        statusCode: err.status,
        errors: {
          email: "User with that username already exists"
        }
      })
    }
    else {
    const user = await User.signup({ email, username, password, firstName, lastName });
    const newToken = await setTokenCookie(res, user);
    return await res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      // token: newToken
    });
    }
  }
);
module.exports = router;
