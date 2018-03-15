const request       = require('request');
const camperDatabase = require('./camperDatabaseInterface');

var camper    = 'https://randomuser.me/api/?results=20';

function getCamperFromDatabase() {
  request(camper, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // detect empty collection indatabase
      camperDatabase.count({}, function(error, count) {
        if (count === 0) {
          const Data = JSON.parse(body);
          Data.results.forEach(elemen => {
            camperDatabase.create({
              name: {first: elemen.name.first, last: elemen.name.last},
              picture: {large: elemen.picture.large},
              gender: elemen.gender,
              email: elemen.email,
              location: {
                street: elemen.location.street,
                city: elemen.location.city,
                state: elemen.location.state,
                postcode: elemen.location.postcode
              }
            });
          });
        }
      });

    }
  });
}

module.exports = getCamperFromDatabase;
