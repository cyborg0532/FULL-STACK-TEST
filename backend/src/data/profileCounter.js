const mongoose = require('mongoose');

const ProfileCounter = new mongoose.Schema({
  _id: String,
  sequence: { type: Number, default: 1000 }
});

module.exports = mongoose.models.ProfileCounter || mongoose.model('ProfileCounter', ProfileCounter);
