const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//The validateSignup middleware is composed of the check and handleValidationErrors middleware.
const validateSignup = [
    check('email')
    //It checks to see if req.body.email exists and is an email,
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
    //req.body.username is a minimum length of 4 and is not an email,
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
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

router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, username, password, firstName, lastName } = req.body;
      const existingUser = await User.findOne({
        where: {
          email,
          username
        }
      })
      console.log(existingUser)
      if (existingUser.email) {
        return res.status(403).json(
          {
            "message": "User already exists",
            "statusCode": 403,
            "errors": {
              "email": "User with that email already exists"
            }
          }
        )
      }
      const user = await User.signup({ email, username, password, firstName, lastName });
      await setTokenCookie(res, user);
      return res.json({
        user
      });
    }
  );
// Sign up
// router.post(
//     '/',
//     async (req, res) => {
//       const { email, password, username, firstName, lastName  } = req.body;
//       //call the signup static method on the User model.
//       const user = await User.signup({ email, username, password, firstName, lastName  });
//     //If the user is successfully created, then call setTokenCookie and return a JSON response with the user information.
//       await setTokenCookie(res, user);

//       return res.json({
//         user: user
//       });
//     }
//   );
module.exports = router;
