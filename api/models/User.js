const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  id: ObjectId,
  username: {
    type: String,
    unique: true
  },
  passwd: {
    type: String,
    select: false
  },
  likedVideos: [{
    type: String,
    unique: true
  }],
  disLikedVideos: [{
    type: String,
    unique: true
  }],
  created: Date,
  updated: Date
});

UserSchema.pre('save', () => {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  })
})

module.exports = mongoose.model('User', UserSchema);
