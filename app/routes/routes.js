var mongoose = require('mongoose');
var express = require('express');
var mongoosastic = require('mongoosastic');
var gcm = require('node-gcm');
var assert = require('assert');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://admin:admin@ds021999.mlab.com:21999/prototypedb';

var Users = require('../models/user');
var Patient = require('../models/patient');
var PatientNews = require('../models/patientNews');
var Device = require('../models/device');
var Test = require('../models/test');

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

    // GET Register user route
    app.get('/user', function(req, res, next) {
        res.render('user.ejs', { 

        });
    });

    // GET API Register user route
    app.get('/api/user', function(req, res, next) {
        res.render('user.ejs', { 

        });
    });

    // GET API Users route
    app.get('/api/users', function(req, res, next) {
        Users.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
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

    // GET Test page
    app.get('/api/tests', function(req, res) {
        Test.find(function(err, tests) {
            if (err)
                res.send(err);

            res.json(tests);
        });
    });

    // GET Device with ID page
    app.get('/api/devices/:id', function(req, res) {
        var regid = req.params.id;
        mongoose.model('Device').find({ "regid": regid }, function (err, device) {
          if (err)
                res.send(err);
            res.json(device);

        });
    });

    // GET User with username
    app.get('/api/users/:username', function(req, res) {
        var username = req.params.username;
        mongoose.model('Users').find({ "username": username }, function (err, user) {
          if (err)
                res.send(err);
            res.json(user);
        });
    });

    // POST GCM Push Notification page
    // Documentation: https://github.com/ToothlessGear/node-gcm
    app.post('/sent', function(req, res, next) {
        var datatitle = req.body.title;
        var datamsg = req.body.msg;
        var receiver = req.body.receiver;
        var regTokens = [];

        // console.log(datatitle,datamsg,receiver);

        Device.find(function (err, devices) {
            if (err) return err;
            devices.forEach(function (item) {
                var stringregid = "dwi1T9u3hQM:"+item.regid;
                // console.log("SID", stringregid);
                regTokens.push(stringregid);
                // console.log("ALL", regTokens);
            });

            console.log("regTokens ", regTokens);

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

        });

        res.render('sent.ejs', {
            title : req.body.title,
            message : req.body.msg
        });
    });

    app.post('/updatePatient', function(req, res, next) {
        var cprp = req.body.cprp;
        var firstn = req.body.firstn;
        var lastn = req.body.lastn;
        var diagn = req.body.diagn;
        var triageD = req.body.triageD;
        var regTokens = [];

        // console.log("Patient", cpr, firstn, lastn, diagn, triageD);

        mongoose.model('Patient').find({ "cpr" : cprp }, function (err, patient) {
              if (err) {
                  return console.error(err);
              } else {

                // console.log(req);

                console.log("PATIENT: ", patient);

                Device.find(function (err, devices) {
                    if (err) return err;
                    devices.forEach(function (item) {
                        var stringregid = "dwi1T9u3hQM:"+item.regid;
                        // console.log("SID", stringregid);
                        regTokens.push(stringregid);
                        // console.log("ALL", regTokens);
                    });

                    console.log("regTokens ", regTokens);

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

                    var oldTriage = patient[0].triage;

                    patient[0].cpr = cprp || '';
                    patient[0].firstname = firstn || '';
                    patient[0].lastname = lastn || '';
                    patient[0].diagnosis = diagn || '';
                    patient[0].triage = triageD || '';

                    patient[0].save(function(err) {
                        if (err) return next(err);
                        res.render('patient.ejs', {
                            "cpr" : cprp,
                            "firstname" : firstn,
                            "lastname" : lastn,
                            "triage" : triageD,
                            "triageOld" : oldTriage
                        });
                    });
                });
              }
        });
    });

    // POST Patients page
    app.post('/patients', function(req, res, next) {
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

    // Create a device (accessed at POST http://localhost:3000/api/devices/regid)
    app.post('/api/devices', function(req, res, next) {
        var regid = req.body.regid;

        console.log(req.body);
            
        var device = new Device();
        device.regid = regid;

        // Save the device and check for errors
        device.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Device created!' });
        });
    });

    // Create a test (accessed at POST http://localhost:3000/api/devices/name)
    app.post('/api/tests', function(req, res, next) {
        var name = req.body.name;

        console.log(req.body);
            
        var test = new Test();
        test.name = name;

        // Save the device and check for errors
        test.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Test created!' });
        });
    });

    // POST Register user
    app.post('/registerUser', function(req, res, next) {
        var employeeId = req.body.cpr;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email = req.body.email;
        var phone = req.body.phone;
        var username = req.body.username;
        var password = req.body.password;
        var role = req.body.role;
        var organisation = req.body.org;

        var user = new Users();
        user.employeeId = employeeId;
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.phone = phone;
        user.username = username;
        user.password = password;
        user.role = role;
        user.organisation = organisation;

        user.save(function(err) {
            if (err) return next(err);
            res.render('userRegistered.ejs', { 
                "user" : user 
            });
        });
    });

    // POST API Register user
    app.post('/api/registerUser', function(req, res, next) {
        var employeeId = req.body.cpr;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email = req.body.email;
        var phone = req.body.phone;
        var username = req.body.username;
        var password = req.body.password;
        var role = req.body.role;
        var organisation = req.body.org;

        var user = new Users();
        user.employeeId = employeeId;
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.phone = phone;
        user.username = username;
        user.password = password;
        user.role = role;
        user.organisation = organisation;

        user.save(function(err) {
            if (err) return next(err);
            res.render('userRegistered.ejs', { 
                "user" : user 
            });
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
        var regTokens = [];

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

        Device.find(function (err, devices) {
            if (err) return err;
            devices.forEach(function (item) {
                var stringregid = "dwi1T9u3hQM:"+item.regid;
                // console.log("SID", stringregid);
                regTokens.push(stringregid);
                // console.log("ALL", regTokens);
            });

            console.log("regTokens ", regTokens);

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

            console.log(message);

            patientToks.save(function(err) {
                if (err) return next(err);
                res.render('newsRegistered.ejs', { 
                    "patientToks" : patientToks 
                });
            });
        });
    });

    // POST API NEWS page
    app.post('/api/news', function(req, res, next) {
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
        var regTokens = [];

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

        Device.find(function (err, devices) {
            if (err) return err;
            devices.forEach(function (item) {
                var stringregid = "dwi1T9u3hQM:"+item.regid;
                regTokens.push(stringregid);
            });

            console.log("regTokens ", regTokens);

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

            console.log(message);

            patientToks.save(function(err) {
                if (err) return next(err);
                res.render('newsRegistered.ejs', { 
                    "patientToks" : patientToks 
                });
            });
        });
    });

    // DELETE NEWS with patient cpr
    app.delete('/news/:cpr', function(req, res) {
      PatientNews.remove({
        cpr: req.params.cpr
      }, function(err, news) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
      });
    });

    // DELETE API NEWS with patient cpr
    app.delete('/api/news/:cpr', function(req, res) {
      PatientNews.remove({
        cpr: req.params.cpr
      }, function(err, news) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
      });
    });

    // DELETE API Patient with patient cpr
    app.delete('/api/patients/:cpr', function(req, res) {
      Patient.remove({
        cpr: req.params.cpr
      }, function(err, news) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Patient successfully deleted' });
      });
    });

    // DELETE Patient with patient cpr
    app.delete('/patients/:cpr', function(req, res) {
      Patient.remove({
        cpr: req.params.cpr
      }, function(err, news) {
        if (err) {
          return res.send(err);
        }
        res.json({ message: 'Patient successfully deleted' });
      });
    });

    app.get('/patients/:cpr', function(req, res) {
       Patient.remove({
          cpr: req.params.cpr
       }, function(err, patient) {
          if (err) {
            return res.send(err);
          }
       });

        // mongoose.model('Patient').find(function (err, patients) {
        //       if (err) {
        //           return console.error(err);
        //       } else {
        //           res.render('patients.ejs', {
        //               "patients" : patients
        //           });
        //       }
        // });
        res.redirect('/patients');
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
