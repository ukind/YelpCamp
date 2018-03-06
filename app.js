var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

let dataArray = [];
// let registeredCamper = {
//   name: {first: '', last: ''},
//   picture: {large: ''}
// };

var camper = 'https://randomuser.me/api/?results=20';

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/camper', function(req, res) {

  request(camper, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const Data = JSON.parse(body);
      Data.results.forEach(elemen => {
        dataArray.push(elemen);
      });
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
  dataArray.unshift(registeredCamper);
  res.redirect('/camper');

});

app.get('/camper/new', function(req, res) {
  res.render('new');
});

app.get('*', (req, res) => {
  res.send('page not found');
});

app.listen(12345, process.env.IP, () => {
  // clearing console
  console.log('\x1Bc');
  console.log('server started');
});
