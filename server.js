var express  = require('express');
var https = require('https');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var requirejs = require('requirejs');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// Connect to MongoDB
mongoose.connect(configDB.url,  function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});
require('./app/models/sp.server.model');
require('./app/models/booking.server.model');

require( './app/models/user' );

// Pass PassportJS for configuration
require('./config/passport')(passport);

// Log every request to the console
app.use(morgan('dev'));

// Read the cookies (needed for auth)
app.use(cookieParser());

// Get information from the HTML forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up ejs for templating
app.set('view engine', 'ejs');

// Set up access to static files
app.use("/css", express.static(__dirname + '/views/css'));
app.use("/less", express.static(__dirname + '/views/less'));
app.use("/lib", express.static(__dirname + '/views/lib'));
app.use("/models", express.static(__dirname + '/app/models'));
app.use("/controller", express.static(__dirname + '/app/controller'));
app.use("/routes", express.static(__dirname + '/app/routes'));
app.use("/views", express.static(__dirname + '/views'));


app.use(session({ secret: 'thestylingerverysecretsessionsecret?' }));

// Allows the user to stay logged-in when navigatinb between different pages
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes/routes.js')(app, passport);
require('./app/routes/sp.server.routes.js')(app, passport);
require('./app/routes/booking.server.routes.js')(app, passport);

app.listen(port);
console.log('Server running on port ' + port);
