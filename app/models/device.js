var mongoose = require('mongoose');

// Define the schema for the Patients model
var device = mongoose.Schema({
	regid: { type: String, default: '' }
});

module.exports = mongoose.model('Device', device);
