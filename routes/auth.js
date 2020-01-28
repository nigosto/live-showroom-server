const router = require('express').Router();
const { body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/User');

router.post('/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please, enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        })
      }),
    body('password')
      .trim()
      .isLength({ min: 4 })
      .withMessage('A password should contain at least 4 numbers or letters'),
    body('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please, enter username.'),
    body('firstName')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please, enter first name.'),
    body('lastName')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please, enter last name.')
  ]
  , authController.signUp);
router.post('/signin', authController.signIn);

module.exports = router;
