var path = require('path');
var http = require('http');
var express = require('express');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Renders the homepage
 */
app.get('/', function (req, res) {
  res.render('index', {
    schemeAndHttpHost: getSchemeAndHttpHost(req),
  });
});

/**
 * Returns an object containing unix timestamp and date in natural language form
   for a date given as unix timestamp or in natural language form.
 */
app.get('/:input', function (req, res) {
  var input = req.params.input;
  var timestamp = parseNaturalDate(input) || parseInt(input) * 1000;
  var data = isNaN(timestamp) ? null : {
    unix: Math.floor(timestamp / 1000),
    natural: formatNaturalDate(timestamp)
  }
  res.json(data);
});

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function () {
  var bind = server.address();
  console.log("Listening on " + bind.address + ':' + bind.port);
});

/**
 * Returns the base website url based on client request
 */
function getSchemeAndHttpHost(request) {
  return request.protocol + '://' + request.get('host');
}

/**
 * Returns the number of milliseconds elapsed since 1 January 1970 for a date
   given in natural language form. Returns NaN if unable to parse the date.
 */
function parseNaturalDate(date) {
  return Date.parse(date);
}

/**
 * Returns date in natural language form from a provided timestamp.
 */
var formatNaturalDate = (function() {
  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return function(timestamp) {
    var date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid timestamp");
    }
    return monthNames[date.getMonth()]
         + ' ' + date.getDate()
         + ', ' + date.getFullYear();
  };
})();
