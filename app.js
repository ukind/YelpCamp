const express       = require('express');
const request       = require('request');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const passport      = require('passport');
const localStrategy = require('passport-local');

// CUSTOM REQUIRE
const CamperInterface = require('./models/camperDatabaseInterface');
const GetCamperFromDatabaseJSON = require('./models/seedDBJSON');
const SeedDB = require('./models/seedDB');
const comment = require('./models/comments');
const camperCounter = require('./models/camperCounter');
const camperCollection = require('./models/user');
const bootstrapJS   = './node_modules/bootstrap/dist/js';
const bootstrapCSS  = './node_modules/bootstrap/dist/css';

var app       = express();

// EXPRESS USES
app.use(bodyParser.urlencoded({extended: true}));
app.use('/user', express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + bootstrapJS));
app.use('/vendor', express.static(__dirname + bootstrapCSS));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/yelpcamp');

// AUTHENTIFICATION function
app.use(require('express-session')({
  secret: 'test',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(camperCollection.authenticate()));
passport.serializeUser(camperCollection.serializeUser());
passport.deserializeUser(camperCollection.deserializeUser());

// CAMPER FUNCTION COUNTER
let sumCamper;
function calculateCamper() {
  var camperSum = Promise.resolve(camperCounter).then(value => {
    sumCamper = value;
  });
};

// PASSING VARIABLE GLOBALLY IN EPRESS TO EJS
app.use(function(req, res, next) {
  res.locals.camperCounterHTML = sumCamper;
  next();
});


app.use(function(req, res, next) {
    if (typeof req.user == 'undefined') {
      res.locals.loggedUser = null;
      return next();
    }
    res.locals.loggedUser = req.user;
    next();
  });

// ROUTES

app.get('/', (req, res) => {
  res.redirect('/camper');
});

// ROUTE: CAMPER
app.get('/camper',  function(req, res) {
  // GetCamperFromDatabaseJSON();
  // SeedDB.removeAllCamper();
  // SeedDB.camperCreator();
  console.log(req.user);
  calculateCamper();
  CamperInterface.count({}, function(error, count) {
    if (count >= 0) {
      CamperInterface.find({}, function(error, data) {
          calculateCamper();
          res.render('./camper/camper', {camperHTML: data});
        });
    }
  });

});

// ROUTES: NEW CAMPER
app.post('/camper', function(req, res) {
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

// ROUTE: GET FORM
app.get('/camper/new', function(req, res) {
  calculateCamper();
  res.render('./camper/new', {camperCounterHTML: sumCamper});
});

// ROUTE: GET CAMPER DETAIL
app.get('/camper/:id', function(req, res) {
  const camperId = req.params.id;
  CamperInterface.findById(camperId)
    .populate('comments') //joining data from comments collection
    .exec(function(error, result) {
      if (error) {
        console.log(error);
      }
      calculateCamper();
      res.render('./camper/show', {camperIDHtml: result});
    });
});

// ROUTE: GET COMMENT CAMPER
app.get('/camper/:id/comments/new', isLoggedIn, (req, res) => {
  const camperID = req.params.id;
  CamperInterface.findById(camperID, function(err, result) {
    calculateCamper();
    res.render('./comment/new', {camperComment: result});
  });

});

// ROUTE: NEW COMMENT CAMPER
app.post('/camper/:id/comment', isLoggedIn, (req, res) => {
  const camperID = req.params.id;
  CamperInterface.findById(camperID, (error, camper) => {
    if (error) {
      console.log(error);
      res.redirect('/camper');
    }
    const commentContainer = req.body.comment;
    comment.create(commentContainer, (error, result) => {
      camper.comments.push(result);
      camper.save();
      res.redirect('/camper/' + camper._id);
    });
  });
});

// ROUTE: REGISTER
// app.get('/register', (req, res) => {
//   calculateCamper();
//   res.render('./camper/register', {camperCounterHTML: sumCamper});
// });
//
// app.post('/register', (req, res) => {
//   const newUser = new camperCollection({username: req.body.username});
//   const password = req.body.password;
//   camperCollection.register(newUser, password, (error, user) => {
//     if (error) {
//       console.log(error);
//       return res.render('./camper/register');
//     }
//     passport.authenticate('local')(req, res, () => {
//       res.redirect('./camper');
//     });
//   });
// });

// ROUTE : LOGIN

app.get('/login', (req, res) => {
  calculateCamper();
  res.render('./camper/login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/camper',
  failureRedirect: '/login'
}), (req, res) => {

});

// FUNCION: detect session
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}



// ROUTE: LOGOUT
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/camper');
});

app.get('*', (req, res) => {
  res.send('page not found');
});

app.listen(12345, '127.0.0.1', () => {
  // clearing console
  console.log('\x1Bc');
  console.log('server started');
});
