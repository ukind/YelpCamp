const express = require('express');
const router = express.Router();
const passport      = require('passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const CamperInterface = require('../models/camperDatabaseInterface');

router.use(bodyParser.urlencoded({extended: true}));
router.use(methodOverride('_method'));

// ROUTE: CAMPER
router.get('/camper',  function(req, res) {
  // GetCamperFromDatabaseJSON();
  // SeedDB.removeAllCamper();
  // SeedDB.camperCreator();
  // console.log(req.user);
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
  const password = req.body.password;
  const camperNameFirst = req.body.firstName;
  const camperNameLast = req.body.lastName;
  const imageUrl = req.body.imageURL;
  const newUser = new CamperInterface(
    {
      username: req.body.username,
      roles: 'Camper',
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
    });
  var empty;
  CamperInterface.register(newUser, password, (error, user) => {
    if (error) {
      console.log(error);
      return res.render('./camper/register');
    }
    passport.authenticate('camper')(req, res, () => {
      // console.log(res);
      res.redirect('/camper');
    });
  });
});

// EDIT CAMPER ACCOUNT

router.get('/camper/edit/:id', isLoggedIn, (req, res) => {
  CamperInterface.findById(req.params.id, (err, found) => {
    if (err) {
      console.log(err);
    }
    res.render('./camper/edit');
  });
});

router.put('/camper/edit/:id', isLoggedIn, (req, res) => {
  const id = req.params.id;
  const password = req.body.edit.password;
  CamperInterface.findByIdAndUpdate(id, {
    name: {
      first: req.body.edit.firstName,
      last: req.body.edit.lastName
    },
    picture: {
      large: req.body.edit.imageURL
    },
    username: req.body.edit.username
  }, (error, resultEdit) => {
    if (error) {
      console.log(error);
    } else {
      // FUNCITON: TO EDIT PASSWORD HASH
      CamperInterface.findById(id).then(function(result) {
        if (result) {
          result.setPassword(password, function() {
            result.save();
            // FUNCTION: SEND UPDATED SESSION AFTER CHANGE USERNAME ETC
            req.login(result, function(error) {
              if (error) {
                return next(error);
              }
              return res.redirect('/camper/' + id);
            });
          });
        }
      });
    }
  });
});

// DELETE CAMPER BY CAMPER ITSELF
router.delete('/camper/delete/:id', (req, res) => {
  const camperID = req.params.id;
  CamperInterface.findByIdAndRemove(camperID, (error) => {
    if (error) {
      console.log(error);
    }
    res.redirect('/camper');
  });
});

// SESSION DETECTION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
