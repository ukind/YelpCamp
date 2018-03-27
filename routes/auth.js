const express = require('express');
const router = express.Router();
const passport      = require('passport');

// ROUTE : LOGIN
router.get('/login', (req, res) => {
  res.render('./camper/login');
});

router.post('/login', passport.authenticate('camper', {
  failureFlash: true,
  successFlash: 'Welcome back!',
  successRedirect: '/camper',
  failureRedirect: '/login'
}), (req, res) => {

});

// ROUTE: LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Now you logout');
  res.redirect('/camper');
});

// ROUTE: ADMIN LOGIN
router.get('/admin/login', (req, res) => {
  res.render('./admin/login');
});

router.post('/admin/login', passport.authenticate('admin', {
  successRedirect: '/camper',
  failureRedirect: '/admin/login'
}), (req, res) => {

});

// ROUTE: LOGOUT
router.get('/admin/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Now you logout');
  res.redirect('/camper');
});

module.exports = router;
