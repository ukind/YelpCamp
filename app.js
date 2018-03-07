const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const bootstrapJS = '/node_modules/bootstrap/dist/js';
const bootstrapCSS = '/node_modules/bootstrap/dist/css';
let db;

let dataArray = [];
var camper = 'https://randomuser.me/api/?results=20';

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use('/user', express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + bootstrapJS));
app.use('/vendor', express.static(__dirname + bootstrapCSS));
app.set('view engine', 'ejs');

//selecting database: yelpcamp {not collection}
mongoClient.connect(
  'mongodb://ukind:kagekuman@ds253468.mlab.com:53468/yelpcamp',
  function(error, client) {
  if (error) {
    return console.log(error);
  }
  db = client.db('yelpcamp');

  app.listen(12345, process.env.IP, () => {
    // clearing console
    console.log('\x1Bc');
    console.log('server started');
  });
});

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/camper', function(req, res) {
  request(camper, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      if (dataArray.length === 0) {
        const Data = JSON.parse(body);
        Data.results.forEach(elemen => {
          dataArray.push(elemen);
          // creating collection in database named camper
          db.collection('camper').save(elemen, (error, result) => {
            if (error) {
              return console.log(error);
            }
            console.log('data saved');
          });
        });
      }
      res.render('camper', {camperHTML: dataArray});
    }
  });
});

app.post('/camper', function(req, res) {
  const camperNameFirst = req.body.camperNameFirst;
  const camperNameLast = req.body.camperNameLast;
  const imageUrl = req.body.camperImage;
  const registeredCamper = {};
  registeredCamper.name = {first: camperNameFirst, last: camperNameLast};
  registeredCamper.picture = {large: imageUrl || ''};
  // creating collection in database named camper
  db.collection('camper').save(registeredCamper, (error, result) => {
    if (error) {
      return console.log(error);
    }
    console.log('data saved');
  });
  dataArray.unshift(registeredCamper);
  res.redirect('/camper');

});

app.get('/camper/new', function(req, res) {
  res.render('new');
});

app.get('*', (req, res) => {
  res.send('page not found');
});
