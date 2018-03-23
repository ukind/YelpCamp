// const CommentsDatabaseInterface = require('./comments');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const camperSchema = new mongoose.Schema({
  username: String,
  password: String,
  roles: String,
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


camperSchema.plugin(passportLocalMongoose);

const camperDatabase = mongoose.model('camper', camperSchema);
module.exports = camperDatabase;
