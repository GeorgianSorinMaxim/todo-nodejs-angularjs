var mongoose = require('mongoose');
var express = require('express');
var mongoosastic = require('mongoosastic');
var gcm = require('node-gcm');
var assert = require('assert');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://admin:admin@ds021999.mlab.com:21999/prototypedb';

var Patient = require('../models/patient');
var PatientNews = require('../models/patientNews');
var Device = require('../models/device');

var regTokens = ['dwi1T9u3hQM:APA91bEeO94YRuTfCSiDNtSU3-gPJ84VdQ39UYG4AgqQO5wgdH5c_k-1V4rI52SH35lpG9QQ0IAcHrVMp6ig-ef9o8bWPa3SxtYuIDbdsiDpX3qCTxNGcWNu94It3K_EXZtHTIQiFBIgMsYgjaFYsGWtikvj9GQRyw'];
var sender = new gcm.Sender('AIzaSyB4cQyVIO0PCwKXZDs9ivMUxXkLNTCF2m4');
// var sender = new gcm.Sender('DEV-a7659a8b-4ee4-4071-8653-dfa762fa61a6');


module.exports = function(app, passport) {

    // GET Index route
    app.get('/', function(req, res, next) {
        res.render('index.ejs', {

        });
    });

    app.get('/api/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });   
    });

    // GET NEWS route
    app.get('/news', function(req, res, next) {
        res.render('news.ejs', {

        });
    });

    // GET Send route
    app.get('/send', function(req, res, next) {
        res.render('send.ejs', {

        });
    });


    // GET Patients page
    app.get('/patients', function(req, res) {
        mongoose.model('Patient').find(function (err, patients) {
              if (err) {
                  return console.error(err);
              } else {
                  res.render('patients.ejs', {
                      "patients" : patients
                  });
              }
        });
    });

    // GET Patients page
    app.get('/api/patients', function(req, res) {
        Patient.find(function(err, patients) {
            if (err)
                res.send(err);

            res.json(patients);
        });
    });

    // GET NEWS List page
    app.get('/newsList', function(req, res) {
        mongoose.model('PatientNews').find(function (err, newsList) {
              if (err) {
                  return console.error(err);
              } else {
                  res.render('newsList.ejs', {
                      "newsList" : newsList
                  });
              }
        });
    });

        // GET NEWS List page
    app.get('/api/newsList', function(req, res) {
        PatientNews.find(function(err, newsList) {
            if (err)
                res.send(err);

            res.json(newsList);
        });
    });

    // GET Devices page
    app.get('/api/devices', function(req, res) {
        Device.find(function(err, devices) {
            if (err)
                res.send(err);

            res.json(devices);
        });
    });

    // POST GCM Push Notification page
    // Documentation: https://github.com/ToothlessGear/node-gcm
    app.post('/sent', function(req, res, next) {
        var datatitle = req.body.title;
        var datamsg = req.body.msg;
        var receiver = req.body.receiver;
        // console.log(datatitle,datamsg,receiver);

        // SEND GCM PUSH NOTIFICATION
        var message = new gcm.Message();
        message.addNotification({
          title: '' + datatitle + '',
          body: '' + datamsg + '',
          icon: 'icon',
          sound: 'default'
        });

        // console.log(message);

        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if(err) console.error(err);
            else    console.log(response);
        });

        res.render('sent.ejs', {
            "title" : datatitle,
            "msg" : datamsg,
            "receiver" : receiver
        });
    });

    app.post('/updatePatient', function(req, res, next) {
        var cprp = req.body.cprp;
        var firstn = req.body.firstn;
        var lastn = req.body.lastn;
        var diagn = req.body.diagn;
        var triageD = req.body.triageD;

        // console.log("Patient", cpr, firstn, lastn, diagn, triageD);

        mongoose.model('Patient').find({ "cpr" : cprp }, function (err, patient) {
              if (err) {
                  return console.error(err);
              } else {


                // console.log(req);

                console.log("PATIENT: ", patient);

                // SEND GCM PUSH NOTIFICATION
                var message = new gcm.Message();
                message.addNotification({
                  title: 'Triage Update',
                  body: 'Triage level changed from ' + patient[0].triage + ' to ' + triageD + ' for the patient ' + patient[0].firstname + ' ' + patient[0].lastname,
                  icon: 'icon',
                  sound: 'default'
                });

                console.log(message);

                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                    if(err) console.error(err);
                    else    console.log(response);
                });

                patient[0].cpr = cprp || '';
                patient[0].firstname = firstn || '';
                patient[0].lastname = lastn || '';
                patient[0].diagnosis = diagn || '';
                patient[0].triage = triageD || '';

                patient[0].save(function(err) {
                    if (err) return next(err);
                    res.render('patient.ejs', {
                        "patient" : patient
                    });
                });
              }
        });
    });

    // POST Patients page
    app.post('/patients', function(req, res, next) {
        var cpr = req.body.cpr;
        var firstname = req.body.firstname.value;
        var lastname = req.body.lastname.value;
        var triage = req.body.triage.value;
        var diagnosis = req.body.diagnosis.value;
        var doctor = req.body.doctor.value;
        var address = req.body.address.value;
        var city = req.body.city.value;
        var zip = req.body.zip.value;

        var patient = new Patient();
        patient.cpr = cpr;
        patient.firstname = firstname;
        patient.lastname = lastname;
        patient.triage = triage;
        patient.diagnosis = diagnosis;
        patient.doctor = doctor;
        patient.address = address;
        patient.city = city;
        patient.zip = zip;

        patient.save(function(err) {
            if (err) return next(err);
            // return next(patient);
            res.redirect('/patients');
        });
    });

    // Create a patient (accessed at POST http://localhost:3000/api/patients)
    app.post('/api/patients', function(req, res, next) {
        var cpr = req.body.cpr;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var triage = req.body.triage;
        var diagnosis = req.body.diagnosis;
        var doctor = req.body.doctor;
        var address = req.body.address;
        var city = req.body.city;
        var zip = req.body.zip;
            
        var patient = new Patient();
        patient.cpr = cpr;
        patient.firstname = firstname;
        patient.lastname = lastname;
        patient.triage = triage;
        patient.diagnosis = diagnosis;
        patient.doctor = doctor;
        patient.address = address;
        patient.city = city;
        patient.zip = zip;

        // Save the patient and check for errors
        patient.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Patient created!' });
        });
    });

    // Create a device (accessed at POST http://localhost:3000/api/device/id)
    app.post('/api/devices/:regid', function(req, res, next) {
        var regid = req.params.regid;
            
        var device = new Device();
        device.regid = regid;

        // Save the device and check for errors
        device.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Device created!' });
        });
    });

    // POST NEWS page
    app.post('/news', function(req, res, next) {
        var cpr = req.body.cpr;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var respiration = req.body.respiration;
        var oxygenSat = req.body.oxygenSat;
        var oxygen = req.body.oxygen;
        var temp = req.body.temp;
        var systolic = req.body.systolic;
        var heartRate = req.body.heartRate;
        var consciousness = req.body.consciousness;
        var score = parseInt(respiration) + parseInt(oxygenSat) + parseInt(oxygen) + parseInt(temp) + parseInt(systolic) + parseInt(heartRate) + parseInt(consciousness);

        var patientToks = new PatientNews();
        patientToks.cpr = cpr;
        patientToks.firstname = firstname;
        patientToks.lastname = lastname;
        patientToks.respiration = respiration;
        patientToks.oxygenSat = oxygenSat;
        patientToks.oxygen = oxygen;
        patientToks.temperature = temp;
        patientToks.systolic = systolic;
        patientToks.heartRate = heartRate;
        patientToks.consciousness = consciousness;
        patientToks.score = score;

        // SEND GCM PUSH NOTIFICATION
        var message = new gcm.Message();
        message.addNotification({
          title: 'NEWS Registered',
          body: 'Score: ' + score + ' registered by ' + firstname + ' ' + lastname + ' CPR: ' + cpr,
          icon: 'icon',
          sound: 'default'
        });

        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if(err) console.error(err);
            else    console.log(response);
        });

        patientToks.save(function(err) {
            if (err) return next(err);
            res.render('newsRegistered.ejs', {
            });
        });
    });


    // Handle 404
    app.use(function(req, res) {
        res.status(404);
        res.render('404.ejs');
    });

    // Handle 500
    app.use(function(error, req, res, next) {
       res.status(500);
       res.render('500.ejs');
    });
};
