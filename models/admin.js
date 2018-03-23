const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  roles: String
});

AdminSchema.plugin(passportLocalMongoose);
const adminCollection = mongoose.model('adminLogin', AdminSchema);

module.exports = adminCollection;
