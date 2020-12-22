const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MovieSchema = new Schema({
  id: ObjectId,
  userCreated: {
    type: ObjectId,
    required: [true, 'User created is missing!']
  },
  title: {
    type: String,
    required: [true, 'Video has no title?']
  },
  description: {
    type: String,
    default: ''
  },
  likeCount: {
    type: Number,
    default: 0
  },
  disLikeCount: {
    type: Number,
    default: 0
  },
  body: String,
  date: Date
});

module.exports = mongoose.model('Movie', MovieSchema);