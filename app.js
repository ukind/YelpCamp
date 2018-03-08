const express       = require('express');
const request       = require('request');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const bootstrapJS   = '/node_modules/bootstrap/dist/js';
const bootstrapCSS  = '/node_modules/bootstrap/dist/css';

var camper    = 'https://randomuser.me/api/?results=20';
var app       = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/user', express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + bootstrapJS));
app.use('/vendor', express.static(__dirname + bootstrapCSS));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/yelpcamp');

// database schemas
const camperSchema = new mongoose.Schema({
  name: {first: String, last: String},
  picture: {large: String},
  gender: String,
  email: String,
  location: {
    street: String,
    city: String,
    state: String,
    postcode: String
  }
});

const camperDatabase = mongoose.model('camper', camperSchema);

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/camper', function(req, res) {
  request(camper, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // detect empty collection indatabase
      camperDatabase.count({}, function(error, count) {
        if (count === 0) {
          const Data = JSON.parse(body);
          Data.results.forEach(elemen => {
            camperDatabase.create({
              name: {first: elemen.name.first, last: elemen.name.last},
              picture: {large: elemen.picture.large},
              gender: elemen.gender,
              email: elemen.email,
              location: {
                street: elemen.location.street,
                city: elemen.location.city,
                state: elemen.location.state,
                postcode: elemen.location.postcode
              }
            });
          });
        }
      });
      camperDatabase.count({}, function(error, count) {
        if (count >= 0) {
          camperDatabase.find({}, function(error, data) {
              res.render('camper', {camperHTML: data});
            });
        }
      });
    }
  });

});

app.post('/camper', function(req, res) {
  const camperNameFirst = req.body.camperNameFirst;
  const camperNameLast = req.body.camperNameLast;
  const imageUrl = req.body.camperImage;
  var empty;

  camperDatabase.create({
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
  camperDatabase.findById(camperId, function(error, result) {
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
