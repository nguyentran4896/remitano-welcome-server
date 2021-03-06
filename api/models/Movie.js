const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MovieSchema = new Schema({
  id: ObjectId,
  userCreated: {
    type: ObjectId,
    required: [true, 'User created is missing!']
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Video has no title?']
  },
  description: {
    type: String,
    default: ''
  },
  likes: [String],
  disLikes: [String],
  date: Date
});

module.exports = mongoose.model('Movie', MovieSchema);