var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose'); //mongo connection
var express = require('express');
var mongoosastic = require('mongoosastic');
var router = express.Router();

// Load the User model
var User = require('../models/user');
var ServiceProviders = require('../models/sp.server.model');
var Booking = require('../models/booking.server.model');

var serviceproviders = require('../controller/sp.server.controller');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://admin:fredperry2011@ds039165.mongolab.com:39165/demo';
// var url = 'mongodb://localhost';
var stripe = require('stripe')("sk_test_nBAZsNNan6Lpdk92iWlFSDb7");

module.exports = function(app, passport) {

    // Home route
    app.get('/', function(req, res, next) {
        res.render('index.ejs', {
          user : req.user
        });
    });

    // GET Results page
    app.get('/results', function(req, res) {
        var loc = req.query.location;
        var service = req.query.serviceType;
        var men = req.query.men;
        var promotions = req.query.promotions;

        console.log(men, promotions);

        //check if men or promotions exist and then make the necessary QUERIES
        if(men)
        {
            mongoose.model('ServiceProvider').find( { $text: { $search: loc }, offeredServices: { $elemMatch: { id: service } }, menServices: men }, function (err, serviceproviders) {
                if (err) {
                    return console.error(err);
                } else {
                    res.render('results.ejs', {
                      "serviceproviders" : serviceproviders,
                      location : req.location,
                      serviceType : service,
                      user : req.user
                    });
                }
            });
        }

        if(promotions)
        {

        }

        mongoose.model('ServiceProvider').find( { $text: { $search: loc }, offeredServices: { $elemMatch: { id: service } } }, function (err, serviceproviders) {
            if (err) {
                return console.error(err);
            } else {
                res.render('results.ejs', {
                  "serviceproviders" : serviceproviders,
                  location : req.location,
                  serviceType : service,
                  user : req.user
                });
            }
        });
    });

    // GET Selected company
    app.get('/companies/:name', function(req, res) {
        var query = req.params.name; // Get the parameters from the URL

        mongoose.model('ServiceProvider').find({ name: query }, function (err, serviceprovider) {
              if (err) {
                  return console.error(err);
              } else {
                  res.render('companies.ejs', {
                      user : req.user,
                      "serviceprovider" : serviceprovider
                  });
              }
        });
    });

    // GET Checkout
    app.get('/checkout', function(req, res) {
        var date = req.query.datepicker;
        var time = req.query.timepicker;
        var ids = req.query.serviceprovider;
        var selectedID = req.query.selectedID;
        var selectedName = req.query.selectedName;
        var selectedPrice = req.query.selectedPrice;
        var selectedDuration = req.query.selectedDuration;

        mongoose.model('ServiceProvider').find({ "_id": ObjectId(ids) }, function (err, serv) {
              if (err) {
                  return console.error(err);
              } else {
                  res.render('checkout.ejs', {
                    "serv" : serv,
                    user : req.user,
                    datepicker : date,
                    timepicker : time,
                    selectionID : selectedID,
                    selectionName : selectedName,
                    selectionPrice : selectedPrice,
                    selectionDuration : selectedDuration,
                  });
              }
        });
    });

    // POST Checkout
    app.post('/confirm', function(req, res, next) {
        // UUID for idempotency = safely retrying requests without accidentally performing the same operation twice
        var serviceproviderID = req.body.serviceproviderID;
        var serviceproviderN = req.body.serviceproviderN;
        var serviceproviderA = req.body.serviceproviderA;
        var serviceproviderT = req.body.serviceproviderT;
        var serviceproviderP = req.body.serviceproviderP;
        var selectionName = req.body.selectionName;
        var datepicker = req.body.datepicker;
        var timepicker = req.body.timepicker;
        var price = req.body.price;
        var comments = req.body.comments;
        var user = req.user;

        function guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4();
        }

        var uuid = guid();
        // console.log(uuid);

        var token_id = req.body.stripeToken;
        // console.log(token_id);

        var charge = stripe.charges.create({
          amount: price * 100, // 0,01 * 100 = 1
          currency: "dkk",
          source: token_id,
          description: "Charge for " + user.local.email
        }, function(err, charge) {
          if (err && err.type === 'StripeCardError') {
            // The card has been declined
          }
          var chargeId = charge.id;

          var booking = new Booking();
          booking.serviceprovider = serviceproviderID;
          booking.user = user;
          booking.totalPrice = price;
          booking.hour = timepicker;
          booking.date = datepicker;
          booking.bookingId = uuid;
          booking.comments = comments;
          booking.service = selectionName;
          booking.customerToken = token_id;
          booking.chargeId = chargeId;

          booking.save(function(err) {
              if (err) return next(err);
              return next(booking);
          });
        });

        res.render('confirm.ejs', {
          user : req.user,
          "uuid" : uuid,
          "charge" : charge,
          "serviceproviderN" : serviceproviderN,
          "serviceproviderA" : serviceproviderA,
          "serviceproviderT" : serviceproviderT,
          "serviceproviderP" : serviceproviderP,
          "datepicker" : datepicker,
          "timepicker" : timepicker,
          "price" : price,
          "comments" : comments
        });
    });

    // GET Confirm
    app.get('/confirm', function(req, res) {
        res.render('confirm.ejs', {
          serviceprovider : req.serviceprovider,
          user : req.user
        });
    });

    // Get Listed route
    app.get('/getlisted', function(req, res) {
        res.render('getlisted.ejs', {
            user : req.user
        });
    });

    // About route
    app.get('/about', isLoggedIn, function(req, res) {
        res.render('about.ejs', {
            user : req.user
        });
    });

    // Reviews route
    app.get('/reviews', isLoggedIn, function(req, res) {
        var user = req.user;
        var uid = user._id;

        mongoose.model('Booking').find({"user": uid }, function (err, bookings) {
            if (err) {
                return console.error(err); }
            if (!bookings.length) {
                var none = "none";
                res.render('reviews.ejs', {
                  "bookings" : "none",
                  user : req.user
                });
            } else {

                bookings.forEach( function(booking) {
                  mongoose.model('ServiceProvider').find({ "_id": booking.serviceprovider }, function (err, serviceprovider) {

                      if (err) {
                          return console.error(err);
                      } else {

                         function extend(obj, src) {
                            for (var key in src) {
                                if (src.hasOwnProperty(key)) obj[key] = src[key];
                            }
                            return obj;
                         }

                         var resultObj = Object.assign({}, booking, serviceprovider);
                         var c = extend(serviceprovider, booking);

                         console.log(resultObj);
                         sendBooking(resultObj);
                      }
                  });
                });

                var bookingsp = [];
                var completed = 0;

                function sendBooking(queryResult) {
                    bookingsp.push(queryResult);
                    completed++;
                    if (completed == bookings.length){
                      // console.log(bookingsp);
                      res.render('reviews.ejs', {
                        "bookings" : bookingsp,
                        user : req.user
                      });
                    }
                }
            }
        });
    });

    // Review route
    app.get('/review/:id', isLoggedIn, function(req, res) {
        var id = req.params.id;

        mongoose.model('Booking').find({ "_id": ObjectId(id) }, function (err, booking) {
              if (err) {
                  return console.error(err);
              } else {
                  // console.log(booking[0]);
                  var ids = booking[0].serviceprovider;

                  mongoose.model('ServiceProvider').find({ "_id": ids }, function (err, serviceprovider) {
                        if (err) {
                            return console.error(err);
                        } else {
                          res.render('review.ejs', {
                            "booking" : booking,
                            "serviceprovider" : serviceprovider,
                            user : req.user
                          });
                        }
                  });
              }
        });
    });

    // POST Review
    app.post('/review', isLoggedIn, function(req, res, next) {
        var user = req.user;
        var bookingId = req.body.idb;

        var title = req.body.title;
        var review = req.body.review;
        var ambiance = req.body.ambiance / 10;
        var service = req.body.service / 10;
        var value = req.body.value / 10;
        var average = parseFloat((parseFloat(ambiance) + parseFloat(service) + parseFloat(value)) / 3).toFixed(1);

        var booked = new Date();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();

        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        var today = dd+'/'+mm+'/'+yyyy;

        // console.log(bookingId, title, review, ambiance, service, value, average, today, user);

        mongoose.model('Booking').find({"_id": bookingId }, function (err, booking) {
            if (err) {
                return console.error(err);
            } else {
                booking[0].reviewed = true;
                booking[0].review.title = title;
                booking[0].review.comment = review;
                booking[0].review.ambiance = ambiance;
                booking[0].review.service = service;
                booking[0].review.value = value;
                booking[0].review.average = average;
                booking[0].review.date = today;
                booking[0].review.author = user.local.profile.firstname + " " + user.local.profile.lastname;

                booking[0].save(function(err) {
                    if (err) return next(err);
                    res.redirect('/reviews');
                });
            }
        });
    });

    // Bookings route
    app.get('/bookings', isLoggedIn, function(req, res) {
        var user = req.user;
        var uid = user._id;

        mongoose.model('Booking').find({"user": uid }, function (err, bookings) {
            if (err) {
                return console.error(err);
            }
            if (!bookings.length) {
                var none = "none";
                res.render('bookings.ejs', {
                  "bookings" : "none",
                  user : req.user
                });
            } else {

                bookings.forEach( function(booking) {
                  mongoose.model('ServiceProvider').find({ "_id": booking.serviceprovider }, function (err, serviceprovider) {

                      if (err) {
                          return console.error(err);
                      } else {

                         function extend(obj, src) {
                            for (var key in src) {
                                if (src.hasOwnProperty(key)) obj[key] = src[key];
                            }
                            return obj;
                         }

                         var resultObj = Object.assign({}, booking, serviceprovider);
                         var c = extend(serviceprovider, booking);
                         sendBooking(resultObj);
                      }
                  });
                });

                var bookingsp = [];
                var completed = 0;

                function sendBooking(queryResult) {
                    bookingsp.push(queryResult);
                    completed++;
                    if (completed == bookings.length){
                      res.render('bookings.ejs', {
                        "bookings" : bookingsp,
                        user : req.user
                      });
                    }
                }
            }
        });
    });

    // Cancel booking
    app.post('/cancel', isLoggedIn, function(req, res) {
        var user = req.user;
        var bookingId = req.body.bookingId;

        mongoose.model('Booking').find({"_id": bookingId }, function (err, booking) {
            if (err) {
                return console.error(err);
            } else {

                booking[0].cancelled = true;

                var refund = stripe.refunds.create({
                  charge: booking[0].chargeId
                }, function(err, refund) {
                  // asynchronously called
                });

                booking[0].save(function(err) {
                    if (err) return next(err);
                    res.redirect('/bookings');
                });
            }
        });
    });

    // Profile route
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user,
            message: req.flash('none', '')
        });
    });

    // Profile POST UpdateProfile
    app.post('/profile', isLoggedIn, function(req, res, next) {
        var user = req.user;

        var yyyy = new Date().getFullYear() - parseInt(req.body.doby, 10);
        var mm = parseInt(dobmonth = req.body.dobm)+1;

        user.local.profile.email = req.body.email || '';
        user.local.profile.firstname = req.body.firstname || '';
        user.local.profile.lastname = req.body.lastname || '';
        user.local.profile.dobyear = yyyy || '';
        user.local.profile.dobmonth = mm || '';
        user.local.profile.dobday = req.body.dobd || '';
        user.local.profile.newsletter = req.body.newsletter || '';
        user.local.profile.gender = req.body.gender || 'unknown';
        user.local.profile.address = req.body.address || '';
        user.local.profile.zip = req.body.zip || '';
        user.local.profile.city = req.body.city || '';
        user.local.profile.phone = req.body.phone || '';
        user.local.profile.language = req.body.language || '';

        user.save(function(err) {
            if (err) return next(err);
            res.render('profile.ejs', {
                user : req.user,
                message: req.flash('success', 'Profile information updated.')
            });
        });
    });

    app.get('/profile/password', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user,
            message: req.flash('none', '')
        });
    });

    // ========================================
    // Profile POST UpdatePassword
    app.post('/profile/password', isLoggedIn, function(req, res, next) {
        var oldPassword = req.body.password;
        var newPassword = req.body.newpassword;
        var confirmPassword = req.body.confirmpassword;

        var user = req.user;

        if (!user.validPassword(oldPassword) || newPassword !== confirmPassword) {
            console.log("WRONG!", user.validPassword(oldPassword), newPassword, confirmPassword);
            req.flash('info', 'Your passwords did not match or the current passord is wrong.');
            res.redirect('/profile');
        }
        else {
            User.findById(req.user.id, function(err, user) {
              if (err) return next(err);

              user.local.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null);

              user.save(function(err) {
                  if (err) return next(err);
                  req.flash('success', 'Your password has been changed.');
                  res.redirect('/profile');
              });
            });
        }
    });

    // ========================================
    // Delete POST DeleteAccuount Route
    app.post('/profile/delete', isLoggedIn, function(req, res, next) {

        User.findById(req.user.id, function(err, user) {
          if (err) return next(err);

          user.local.accountDeleted = true;

          user.save(function(err) {
              if (err) return next(err);
              req.logout();
              res.redirect('/');
          });
        });

        // User.remove({ _id: req.user.id }, function(err) {
        //     if (err) return next(err);
        //     req.logout();
        //     req.flash('info', 'Your account has been deleted.' );
        //     res.redirect('/');
        // });
    });

    // Logout Route
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // Forgot Route
    app.get('/forgot', function(req, res) {
        res.render('forgot.ejs', {
            user : req.user,
            message: req.flash('', '')
        });
    });

    // Forgot Route POST ForgotPassword
    app.post('/forgot', passport.authenticate('reset-password', {
        successRedirect : '/forgot', // redirect to the secure profile section
        failureRedirect : '/forgot', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // ========================================
    // Login (email, password) Route
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // Login POST
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : 'back', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // Login Page POST
    app.post('/loginpage', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =================================
    // Register (email, password) Route
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // Register POST
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =================================
    // Facebook Login Route
    // Re-direct to Facebook in order to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // Handle the callback after the Facebook API has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
      );

    // =================================
    // Twitter Login Route
    // Re-direct to Twitter in order to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

    // Handle the callback after Twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );


    // =================================
    // Google+ Login Route
    // Re-direct to Google in order to do the authentication

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // The callback after Google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );



    // CONNECTING SOCIAL PLATFORMS

    // ========================================
    // Login (email, password) Route
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // ========================================
    // Facebook
    // Send to Facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // Handle the callback after Facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );

    // ========================================
    // Twitter
    // Send to Twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // Handle the callback after Twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );

    // ========================================
    // Google+
    // send to Google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // The callback after Google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );


    // ========================================
    // Used to unlink accounts. for social accounts, just remove the toke for local account, remove email and password user account will stay active in case they want to reconnect in the future

    // ========================================
    // Delete Account
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // ========================================
    // Delete Facebook Account
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // ========================================
    // Delete Twitter Account
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // ========================================
    // Delete Google Account
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
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

// Middleware Route to ensure that the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
