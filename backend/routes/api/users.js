// Phase 4:
const express = require('express')

// Phase 4:
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

// Phase 5:
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Phase 5: Validate signup info middleware
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Please provide a valid first name.'),
    check('lastName')
      .exists({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Please provide a valid last name.'),
    handleValidationErrors
];

// Phase 4: Sign up --> Phase 5: Add validateSignup
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      //check if email or username are in use before signup:
      let userExistsError = {
        message: "User already exists",
        statusCode: 403
      };
      let users = await User.unscoped().findAll(); //.unscoped() to avoid defaultScope excluding email
      for (let user of users) {
        if (user.email === email) {
          userExistsError.errors = {
            email: "User with that email already exists"
          }
          return res.status(403).json(userExistsError);
        } else if (user.username === username) {
          userExistsError.errors = {
            username: "User with that username already exists"
          }
          return res.status(403).json(userExistsError);
        }
      }
      let newUser = await User.signup({ email, username, password, firstName, lastName });

      let token = await setTokenCookie(res, newUser);
      newUser = newUser.toJSON();
      newUser.token = token;

      return res.json({
        user: newUser
      });
    }
);

module.exports = router;
