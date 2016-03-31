var mongoose = require('mongoose');

// Define the schema for the Patients model
var patient = mongoose.Schema({
	cpr: { type: String, default: '' },
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    gender: { type: String, default: 'unknown' },
    dobyear: { type: String, default: '' },
    dobmonth: { type: String, default: '' },
    dobday: { type: String, default: '' },
    address: { type: String, default: '' },
    zip: { type: String, default: '' },
    city: { type: String, default: '' },
    phone: { type: String, default: '' },
    doctor: { type: String, default: '' },
    doctortel: { type: String, default: '' },
    triage: { type: String, default: '' },
    diagnosis: { type: String, default: '' },
});

module.exports = mongoose.model('Patient', patient);
