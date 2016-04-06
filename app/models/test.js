var mongoose = require('mongoose');

// Define the schema for the Patients model
var test = mongoose.Schema({
	name: { type: String, default: '' }
});

module.exports = mongoose.model('Test', test);
