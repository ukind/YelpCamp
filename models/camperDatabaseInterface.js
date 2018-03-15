const mongoose = require('mongoose');
const CommentsDatabaseInterface = require('./comments');

const camperSchema = new mongoose.Schema({
  name: {first: String, last: String},
  picture: {large: String},
  gender: String,
  email: String,
  location: {
    street: String,
    city: String,
    state: String,
    postcode: String
  },
  comments: [
    {
      // penyambung antara camper dengan komentar
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

const camperDatabase = mongoose.model('camper', camperSchema);
module.exports = camperDatabase;
