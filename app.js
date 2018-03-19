const express       = require('express');
const request       = require('request');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const bootstrapJS   = '/node_modules/bootstrap/dist/js';
const bootstrapCSS  = '/node_modules/bootstrap/dist/css';
const CamperInterface = require('./models/camperDatabaseInterface');
const GetCamperFromDatabaseJSON = require('./models/seedDBJSON');
const SeedDB = require('./models/seedDB');
const comment = require('./models/comments');
const camperCounter = require('./models/camperCounter');

var app       = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/user', express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + bootstrapJS));
app.use('/vendor', express.static(__dirname + bootstrapCSS));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/yelpcamp');

// CAMPER COUNTER -------------------

let sumCamper;
function calculateCamper() {
  var camperSum = Promise.resolve(camperCounter).then(value => {
    sumCamper = value;
  });
};

// CAMPER COUNTER -------------------

app.get('/', (req, res) => {
  res.render('./camper/landing');
});

app.get('/camper', function(req, res) {
  // GetCamperFromDatabaseJSON();
  // SeedDB.removeAllCamper();
  //
  // SeedDB.camperCreator();
  calculateCamper();
  CamperInterface.count({}, function(error, count) {
    if (count >= 0) {
      CamperInterface.find({}, function(error, data) {
          calculateCamper();
          res.render('./camper/camper', {camperHTML: data, camperCounterHTML: sumCamper});
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
  calculateCamper();
  res.render('./camper/new', {camperCounterHTML: sumCamper});
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
      calculateCamper();
      res.render('./camper/show', {camperIDHtml: result, camperCounterHTML: sumCamper});
    });
});

// =================================
// COMMENTS ROUTE
// =================================

app.get('/camper/:id/comments/new', (req, res) => {
  const camperID = req.params.id;
  CamperInterface.findById(camperID, function(err, result) {
    calculateCamper();
    res.render('./comment/new', {camperComment: result, camperCounterHTML: sumCamper});
  });

});

app.post('/camper/:id/comment', (req, res) => {
  const camperID = req.params.id;
  console.log(camperID);
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

app.get('*', (req, res) => {
  res.send('page not found');
});

app.listen(12345, process.env.IP, () => {
  // clearing console
  console.log('\x1Bc');
  console.log('server started');
});
