const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const encryption = require('../util/encryption');

function validateUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: 'Validation failed, entered data is incorrect',
      errors: errors.array()
    });
    return false;
  }

  return true;
}

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { username, password, email, firstName, lastName } = req.body;
      let errors = []
      let user = await User.find();
      let usernameCheck = user.filter(u => u.username === username)
      let emailCheck = user.filter(u => u.email === email)
      console.log(usernameCheck)
      if (usernameCheck.length) {
        errors.push("A user with this username already exists!")
      }
      if(emailCheck.length){
        errors.push("A user with this email already exists!")
      }
      if(errors.length){
        res.status(401).json({errors})
      }
      if (validateUser(req, res)) {
        const salt = encryption.generateSalt();
        const hashedPassword = encryption.generateHashedPassword(salt, password);
        User.create({
          email,
          firstName,
          lastName,
          hashedPassword,
          username,
          articles: [],
          comments: [],
          salt,
          roles: ['User']
        }).then((user) => {
          const token = jwt.sign({
            username: user.username,
            userId: user._id.toString()
          }
            , 'turbosecret'
            , { expiresIn: '24h' });
          res.status(201)
            .json({ message: 'You made a successful registration!', userId: user._id, username: user.username, token, isAdmin: user.roles.indexOf('Admin') != -1 });
        })
          .catch((error) => {
            if (!error.statusCode) {
              error.statusCode = 500;
            }

            next(error);
          });
      }
    } catch (err) {
      console.log(err)
    }
  },
  signIn: (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username })
      .then((user) => {
        if (!user) {
          const error = new Error('You have entered invalid username! Please try again!');
          error.statusCode = 401;
          throw error;
        }

        if (!user.authenticate(password)) {
          const error = new Error('You have entered invalid password! Please try again!');
          error.statusCode = 401;
          throw error;
        }

        const token = jwt.sign({
          username: user.username,
          userId: user._id.toString()
        }
          , 'turbosecret'
          , { expiresIn: '24h' });

        res.status(200).json(
          {
            message: 'You logged in successfully!',
            token,
            userId: user._id.toString(),
            username: user.username,
            isAdmin: user.roles.indexOf('Admin') != -1
          });
      })
      .catch(error => {
        if (!error.statusCode) {
          error.statusCode = 500;
        }

        next(error);
      })
  }
};