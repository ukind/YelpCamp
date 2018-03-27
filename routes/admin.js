const express = require('express');
const router = express.Router();
const passport      = require('passport');

const adminCollection = require('../models/admin');
const camperCollection = require('../models/camperDatabaseInterface');

// ROUTE: Admin
router.get('/admin',  function(req, res) {
  res.render('./admin/register');
});

// ROUTES: NEW Admin
router.post('/admin', function(req, res) {
  const newUser = new adminCollection({username: req.body.username, roles: 'Admin'});
  const password = req.body.password;
  adminCollection.register(newUser, password, (error, user) => {
    if (error) {
      console.log(error);
      req.flash('error', error);
      return res.render('./admin/register');
    }
    passport.authenticate('admin')(req, res, () => {
      req.flash('success', 'Welcome, You logged in as Admin')
      res.redirect('/camper');
    });
  });
});

// DELETE CAMPER BY ADMIN
router.delete('/delete/:id', function(req, res) {
  const camperID = req.params.id;
  camperCollection.findByIdAndRemove(camperID, (error) => {
    if (error) {
      req.flash('error', error);
    }
    req.flash('success', 'User has been deleted');
    res.redirect('/camper');
  });
});

module.exports = router;
