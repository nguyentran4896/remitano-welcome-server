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
  password: {
    type: String,
    required: true
  },
  likedVideos: [{
    type: String
  }],
  disLikedVideos: [{
    type: String
  }],
  created: Date,
  updated: Date
});

UserSchema.pre('save', function (next) {
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

UserSchema.methods.comparePassword = function (candidatePassword) {
  let thisUser = this
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, thisUser.password, function (err, isMatch) {
      if (err) return reject(err);
      if (!isMatch) return reject({status: 401, message: 'Wrong password'})
      resolve(thisUser);
    });
  })
};

module.exports = mongoose.model('User', UserSchema);
