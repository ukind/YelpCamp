const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CamperLogin'
    },
    username: String,
    first: String
    }
});

const commentInterface = mongoose.model('Comment', commentSchema);

module.exports = commentInterface;
