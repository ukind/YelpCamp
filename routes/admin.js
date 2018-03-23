const express = require('express');
const router = express.Router();
const passport      = require('passport');

const adminCollection = require('../models/admin');
const camperCollection = require('../models/camperDatabaseInterface');
// ROUTE: Admin
router.get('/admin',  function(req, res) {

  res.render('./admin/register');

});

// ROUTES: NEW CAMPER
router.post('/admin', function(req, res) {
  const newUser = new adminCollection({username: req.body.username, roles: 'Admin'});
  const password = req.body.password;
  adminCollection.register(newUser, password, (error, user) => {
    if (error) {
      console.log(error);
      return res.render('./admin/register');
    }
    passport.authenticate('admin')(req, res, () => {
      res.redirect('/camper');
    });
  });
});

// LOGIN ADMIN

router.get('/delete/:id', function(req, res) {
  const camperID = req.params.id;
  camperCollection.findByIdAndRemove(camperID, (error) => {
    if (error) {
      console.log(error);
    }
    res.redirect('/camper');
  });
});

module.exports = router;
