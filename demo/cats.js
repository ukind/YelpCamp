let mangoose = require('mongoose');
// create database named: Hewan (if not exist)
mangoose.connect('mongodb://localhost/Hewan');

let kakiEmpat = new mangoose.Schema({
  name: String,
  age: Number,
  color: String
});

let kakiDua = new mangoose.Schema({
  name: String,
  age: Number,
  alamat: String
});
// create collection in db (hewans)
const HewanBerkakiEmpat = mangoose.model('berkakiEmpat', kakiEmpat);
const HewanBerkakiDua = mangoose.model('berkakiDua', kakiDua);

HewanBerkakiEmpat.create({
  name: 'Gajah',
  age: 10,
  color: 'Abu-abu'
}, function(error, result) {
  if (error) {
    console.log(error);
  }
  console.log(result);
});
// const hewan = new HewanBerkakiEmpat({
//   name: '',
//   age: '',
//   color: ''
// });
//
// const manusia = new HewanBerkakiDua({
//   name: '',
//   age: '',
//   alamat: ''
// });


// manusia.name = 'Araragi';
// manusia.age = 18;
// manusia.alamat = 'Malang';
//
// hewan.save((error, result) => {
//   if (error) {
//     console.log(error);
//   }
//   console.log(result);
// });
//
// manusia.save((error, result) => {
//   if (error) {
//     console.log(error);
//   }
//   console.log(result);
// });
//
HewanBerkakiEmpat.find({}, function(error, result) {
  if (error) {
    console.log(error);
  }
  console.log('Hewan yang ada....');
  console.log(result);
});
