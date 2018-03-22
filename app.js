const express       = require('express');
const request       = require('request');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const passport      = require('passport');
const localStrategy = require('passport-local');

// CUSTOM REQUIRE

const GetCamperFromDatabaseJSON = require('./models/seedDBJSON');
const SeedDB = require('./models/seedDB');
const camperCollection = require('./models/user');
const camperCounter = require('./models/camperCounter');
const CamperInterface = require('./models/camperDatabaseInterface');
const bootstrapJS   = './node_modules/bootstrap/dist/js';
const bootstrapCSS  = './node_modules/bootstrap/dist/css';

// ROUTES
const commentsRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const camperRoutes = require('./routes/camper');


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

// PASSING VARIABLE GLOBALLY IN EXPREASS TO EJS
app.use(function(req, res, next) {
  calculateCamper();
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

// ROUTE: GET FORM
app.get('/camper/new', function(req, res) {

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

      res.render('./camper/show', {camperIDHtml: result});
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


// USE SPLITTED ROUTER

app.use(commentsRoutes);
app.use(camperRoutes);
app.use(authRoutes);

app.listen(12345, '127.0.0.1', () => {
  // clearing console
  console.log('\x1Bc');
  console.log('server started');
});
