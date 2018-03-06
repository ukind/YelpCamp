var express = require('express');
var request = require('request');
let dataArray = [];

var app = express();

var camper = 'https://randomuser.me/api/?results=20';

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/camper', function(req, res) {

  request(camper, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const Data = JSON.parse(body);

      res.render('camper', {camperHTML: Data.results});
    }
  });
});

app.post('/camper', function(req, res) {

});

app.get('*', (req, res) => {
  res.send('page not found');
});

app.listen(12345, process.env.IP, () => {
  // clearing console
  console.log('\x1Bc');
  console.log('server started');
});
