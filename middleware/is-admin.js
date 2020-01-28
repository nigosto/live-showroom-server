const jwt = require('jsonwebtoken');
const User = require('../models/User')

module.exports = async (req, res, next) => {
  const authHeaders = req.get('Authorization');
  if (!authHeaders) {
    return res.status(401)
      .json({ message: 'Not authenticated.' })
  }

  const token = req.get('Authorization').split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'turbosecret')
    let user = await User.findById(decodedToken.userId)
    if(user.roles.indexOf('Admin') == -1){
        return res.status(401).json({message: 'Not Admin'})
    }
  } catch(error) {
    return res.status(401)
      .json({ message: 'Token is invalid.', error });
  }

  if (!decodedToken) {
    return res.status(401)
      .json({ message: 'Not authenticated.' });
  }

  req.userId = decodedToken.userId;
  next();
};