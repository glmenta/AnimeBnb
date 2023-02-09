const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();


// Sign up
router.post(
    '/',
    async (req, res) => {
      const { email, password, username } = req.body;
      //call the signup static method on the User model.
      const user = await User.signup({ email, username, password });
    //If the user is successfully created, then call setTokenCookie and return a JSON response with the user information.
      await setTokenCookie(res, user);

      return res.json({
        user: user
      });
    }
  );
module.exports = router;
