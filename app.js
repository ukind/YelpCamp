const express       = require('express');
const request       = require('request');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const bootstrapJS   = '/node_modules/bootstrap/dist/js';
const bootstrapCSS  = '/node_modules/bootstrap/dist/css';
const CamperInterface = require('./models/camperDatabaseInterface');
const GetCamperFromDatabaseJSON = require('./models/seedDBJSON');
const SeedDB = require('./models/seedDB');

var app       = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/user', express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + bootstrapJS));
app.use('/vendor', express.static(__dirname + bootstrapCSS));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/yelpcamp');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/camper', function(req, res) {
  // GetCamperFromDatabaseJSON();
  SeedDB.removeAllCamper();
  SeedDB.camperCreator();
  CamperInterface.count({}, function(error, count) {
    if (count >= 0) {
      CamperInterface.find({}, function(error, data) {
          res.render('camper', {camperHTML: data});
        });
    }
  });

});

// creating new camper
app.post('/camper', function(req, res) {
  const camperNameFirst = req.body.camperNameFirst;
  const camperNameLast = req.body.camperNameLast;
  const imageUrl = req.body.camperImage;
  var empty;

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
    console.log(result);
  });

  res.redirect('/camper');

});

app.get('/camper/new', function(req, res) {
  res.render('new');
});

// show more camper
app.get('/camper/:id', function(req, res) {
  const camperId = req.params.id;
  CamperInterface.findById(camperId)
    .populate('comments') //joining data from comments collection
    .exec(function(error, result) {
      if (error) {
        console.log(error);
      }
      res.render('show', {camperIDHtml: result});
    });
});

app.get('*', (req, res) => {
  res.send('page not found');
});

app.listen(12345, process.env.IP, () => {
  // clearing console
  console.log('\x1Bc');
  console.log('server started');
});
