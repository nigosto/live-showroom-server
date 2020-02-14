const mongoose = require('mongoose');
const encryption = require('../util/encryption');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: Schema.Types.String,
    required: true
  },
  firstName: {
    type: Schema.Types.String,
    required: true
  },
  lastName: {
    type: Schema.Types.String,
    required: true 
  },
  hashedPassword: {
    type: Schema.Types.String,
    required: true
  },
  username: {
    type: Schema.Types.String,
    required: true,
    unique: true
  },
  salt: {
    type: Schema.Types.String,
    required: true
  },
  roles: [{type: Schema.Types.String, required: true}],
  inventory: [{
      type: Schema.Types.ObjectId,
      ref: 'Model'
  }]
});

userSchema.method({
  authenticate: function (password) {
    const currentHashedPass = encryption.generateHashedPassword(this.salt, password);

    return currentHashedPass === this.hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
  try {
    let users = await User.find();
    if (users.length > 0) return;
    const salt = encryption.generateSalt();
    const hashedPassword = encryption.generateHashedPassword(salt, 'admin');
    return User.create({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Adminov',
      email: 'admin@gmail.com',
      salt,
      hashedPassword,
      roles: ['Admin']
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = User;