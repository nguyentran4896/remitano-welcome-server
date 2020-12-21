const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Video = new Schema({
  id: ObjectId,
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

module.exports = Video