const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const camperLogin = new mongoose.Schema({
  username: String,
  password: String
});

camperLogin.plugin(passportLocalMongoose);

const camperLoginCollection = mongoose.model('CamperLogin', camperLogin);
module.exports = camperLoginCollection;
