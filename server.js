var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var requirejs = require('requirejs');

var morgan       = require('morgan');
var bodyParser   = require('body-parser');

var configDB = require('./config/database.js');

// Connect to MongoDB
mongoose.connect(configDB.url,  function(err) {
	if (err) {
		console.error('Could not connect to MongoDB!');
		console.log(err);
	}
});

require('./app/models/todo');

// Log every request to the console
app.use(morgan('dev'));

// Get information from the HTML forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up access to static files
app.use("/css", express.static(__dirname + '/views/css'));
app.use("/models", express.static(__dirname + '/app/models'));
app.use("/controller", express.static(__dirname + '/app/controller'));
app.use("/routes", express.static(__dirname + '/app/routes'));
app.use("/services", express.static(__dirname + '/app/services'));

require('./app/routes/routes.js')(app);

app.listen(port);
console.log('Server running on port ' + port);
