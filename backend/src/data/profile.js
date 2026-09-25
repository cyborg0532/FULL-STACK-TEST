const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  Id: {
    type: String,Number, 
    required: true
  },
  Name: {
    type: String,
    required: [true, 'Cant be empty'],
  },
  email: {
    type: String,
    required: [true, 'valid email']
  },
  phone: {
    type: String,
    required: [true, 'cant be empty']
  },
  address: {
    type: String,
    required: [true, 'cant be empty']
  },

   age: {
    type: Number,
    required: [true, 'valid number']
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Profile', ProfileSchema);