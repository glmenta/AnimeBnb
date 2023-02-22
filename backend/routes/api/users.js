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
      .withMessage('Please provide a valid username'),
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
      token: newToken
    });
    }
  }
);
module.exports = router;
// router.post( '/', validateSignup, async (req, res) => {
//     const { email, firstName, lastName, username, password } = req.body;
//     const existingEmail = await User.findOne({ where: { email: email } })
//     const existingUser = await User.findOne({ where: { username: username } })
//     let bodyValErr = {
//       "message": "Validation error",
//       "statusCode": 400,
//       "error": {}
//     }

//     if (!email || email === "" || !email.includes('@') || !email.includes(".")) {
//       bodyValErr.error = {
//         "email": "Please enter a valid email"
//       }
//       return res.json({bodyValErr})
//     }

//     if (!username || username === "") {
//       bodyValErr.error = {
//         "email": "Invalid username"
//       }
//       return res.json({bodyValErr})
//     }

//     if (!firstName || firstName === "") {
//       bodyValErr.error = {
//         "firstName": "First Name is required"
//       }
//       return res.json({bodyValErr})
//     }
//     if (!lastName || lastName === "") {
//       bodyValErr.error = {
//         "lastName": "Last Name is required"
//       }
//       return res.json({bodyValErr})
//     }

//     if (existingEmail) {
//       return res.status(403).json(
//          {
//           "message": "User already exists",
//           "statusCode": 403,
//           "errors": {
//             "email": "User with that email already exists"
//            }
//          }
//       )
//     }

//     if (existingUser) {
//       return res.status(403).json({
//         "message": "User already exists",
//         "statusCode": 403,
//         "errors": {
//           "username": "User with that username already exists"
//         }
//       })
//     }

//       const user = await User.signup({ email, firstName, lastName, username, password, });
//       const userToken = await setTokenCookie(res, user);
//       userInfo = user.toJSON()
//       userInfo.token = userToken
//       return res.json({
//         userInfo
//       });
//     }

    //   const { email, firstName, lastName, password, username } = req.body;
    //   const user = await User.signup({
    //     email,
    //     firstName,
    //     lastName,
    //     username,
    //     password,
    //   });

    //   const returnToken = await setTokenCookie(res, user);

    //   userObj = user.toJSON();
    //   userObj.token = returnToken;

    //   return res.json(userObj);
    // }
  //);

  //if curre user.id = ownerId => authorized;
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
