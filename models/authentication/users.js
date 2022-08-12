const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  preferredName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  hash: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User',
    required: true
  },

  // created: {
  //   type: Date,
  //   immutable: true,
  //   default: () => Date.now(),
  //   required: true
  // },

  // updated: {
  //   type: Date,
  //   default: () => Date.now(),
  //   required: true
  // }
},
{timestamps: true}

);

const User = mongoose.model('User', userSchema)

module.exports = User