const express = require('express');
const router = express.Router();
const passport      = require('passport');

const CamperInterface = require('../models/camperDatabaseInterface');
const comment = require('../models/comments');

// ROUTE: GET COMMENT CAMPER
router.get('/camper/:id/comments/new', isLoggedIn, (req, res) => {
  const camperID = req.params.id;
  CamperInterface.findById(camperID, function(err, result) {

    res.render('./comment/new', {camperComment: result});
  });

});

// ROUTE: NEW COMMENT CAMPER
router.post('/camper/:id/comment', isLoggedIn, (req, res) => {
  const camperID = req.params.id;
  CamperInterface.findById(camperID, (error, camper) => {
    if (error) {
      console.log(error);
      res.redirect('/camper');
    }
    const commentContainer = req.body.comment;
    comment.create(commentContainer, (error, comment) => {
      if (error) {
        console.log(error);
      }
      // masuk ke comment with reference to camperlogin
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.author.first = req.user.name.first;
      comment.save();
      camper.comments.push(comment);
      camper.save();
      res.redirect('/camper/' + camper._id);
    });
  });
});

// FUNCION: detect session
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.roles === 'Admin') {
    res.redirect('/login');
  }
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
