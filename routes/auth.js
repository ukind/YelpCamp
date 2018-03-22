const express = require('express');
const router = express.Router();
const passport      = require('passport');

// ROUTE : LOGIN
router.get('/login', (req, res) => {
  res.render('./camper/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/camper',
  failureRedirect: '/login'
}), (req, res) => {

});

// ROUTE: LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/camper');
});

module.exports = router;
