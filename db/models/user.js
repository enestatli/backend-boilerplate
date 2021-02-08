const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

//TODO: instead of using status codes mb put error itself

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 422],
    unique: true,
    lowercase: true,
    validate: [isEmail, 422],
  },
  password: {
    type: String,
    required: [true, 422],
    minlength: [6, 422],
  },
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    return 401; // unauthrozied
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    return 401;
  }
  return user;
};

var User = mongoose.model('user', userSchema);

userSchema.static.createNew = async function ({ email, password, name }) {
  const isUser = await this.findOne({ email });
  if (isUser && isUser.email) {
    return;
  }
  const user = new User({ name, email, password });

  await user.save();

  return user;
};

module.exports = User;
