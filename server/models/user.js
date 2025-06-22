const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  profilePic: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
