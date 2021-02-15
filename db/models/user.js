const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

//TODO: instead of using error itself mb put status code

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimumum password length is 6 characters'],
  },
  email_verified: { type: Boolean, default: false },
  followers: { type: Array, default: [] },
  followings: { type: Array, default: [] },
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    return 404; // not found
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    return 401; // incorrect password
  }
  return user;
};

userSchema.statics.createNew = async function ({
  email,
  password,
  name,
  email_verified,
}) {
  const isUser = await this.findOne({ email });
  if (isUser && isUser.email) {
    return 409;
  }
  const user = new User({ name, email, password, email_verified });

  await user.save();

  return user;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
