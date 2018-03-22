const express = require('express');
const router = express.Router();
const passport      = require('passport');

const camperCollection = require('../models/user');
const CamperInterface = require('../models/camperDatabaseInterface');


// ROUTE: CAMPER
router.get('/camper',  function(req, res) {
  // GetCamperFromDatabaseJSON();
  // SeedDB.removeAllCamper();
  // SeedDB.camperCreator();
  console.log(req.user);

  CamperInterface.count({}, function(error, count) {
    if (count >= 0) {
      CamperInterface.find({}, function(error, data) {

          res.render('./camper/camper', {camperHTML: data});
        });
    }
  });

});

// ROUTES: NEW CAMPER
router.post('/camper', function(req, res) {
  const newUser = new camperCollection({username: req.body.username});
  const password = req.body.password;
  const camperNameFirst = req.body.firstName;
  const camperNameLast = req.body.lastName;
  const imageUrl = req.body.imageURL;
  var empty;
  camperCollection.register(newUser, password, (error, user) => {
    if (error) {
      console.log(error);
      return res.render('./camper/register');
    }
    passport.authenticate('local')(req, res, () => {
      // console.log(res);
      CamperInterface.create({
        name: {first: camperNameFirst, last: camperNameLast},
        picture: {large: imageUrl || 'https://pingendo.com/assets/photos/wireframe/photo-1.jpg'},
        gender: empty || 'Not available',
        email: empty || 'Not available',
        location: {
          street: empty || 'Not available',
          city: empty || 'Not available',
          state: empty || 'Not available',
          postcode: empty || 'Not available'
        }
      }, function(error, result) {
        if (error) {
          console.log(error);
        }
        res.redirect('/camper');
      });
    });
  });
});

module.exports = router;
