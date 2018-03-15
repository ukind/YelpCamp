const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: String,
  author: String
});

const commentInterface = mongoose.model('Comment', commentSchema);

module.exports = commentInterface;
