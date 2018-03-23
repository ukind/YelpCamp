const mongoose = require('mongoose');
const camperDatabaseInterface = require('./camperDatabaseInterface');
const CommentsDatabaseInterface = require('./comments');

let dummyVar;

const data = [
  {
    name: {first: 'Yogiswara', last: 'Utama'},
    picture: {large: dummyVar ||
      'https://pingendo.com/assets/photos/wireframe/photo-1.jpg'}
  },
  {
    name: {first: 'Ida', last: 'Wahyuni'},
    picture: {large: dummyVar ||
      'https://pingendo.com/assets/photos/wireframe/photo-1.jpg'}
  },
  {
    name: {first: 'Narenda', last: 'Rudi'},
    picture: {large: dummyVar ||
      'https://pingendo.com/assets/photos/wireframe/photo-1.jpg'}
  },
];

function removeAllCamper() {
  camperDatabaseInterface.remove({}, (error, result) => {
    if (error) {
      console.log(error);
    }
    console.log('camper removed');
  });
}

function camperCreator() {
  data.forEach(function(seed) {
    camperDatabaseInterface.create(seed, (error, camper) => {
      if (error) {
        console.log(error);
      }
      console.log('Add camper');
      console.log(camper);
      // create comment data for each user
      CommentsDatabaseInterface.create(
        {
          text: 'So Awesome!',
          author: 'Anonim'
        }, (error, comment) => {
          // add new row for created comment and concate (push) to camper
          camper.comments.push(comment);
          if (error) {
            console.log(error);
          }
          console.log(camper);
          camper.save();
          console.log('create new comment');
        }
      );
    });
  });
}

module.exports = {
  removeAllCamper,
  camperCreator
};
