'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Booking = mongoose.model('Booking'),
    _ = require('lodash');

/**
 * Create a ServiceProvider
 */
 exports.create = function(req, res) {
     var booking = new Booking(req.body);

     booking.save(function(err) {
         if (err) {
             return res.status(400).send({
               message: "400 Error"
             });
         } else {
             res.status(201).json(booking);
         }
     });
 };

/**
 * Show the current ServiceProvider
 */
 exports.read = function(req, res) {
     Booking.findById(req.params.spID).exec(function(err, booking) {
         if (err) {
           return res.status(400).send({
             message: "400 Error"
           });
       } else {
          if (!booking) {
                 return res.status(404).send({
                     message: 'ServiceProvider not found!'
                 });
             }
             res.json(booking);
       }
     });
 };

 /**
 * Show the current Category
 */
exports.readSecond = function(req, res) {
	  res.json(req.booking);
};

/**
 * Update a ServiceProvider
 */
 exports.update = function(req, res) {
   	var booking = req.booking;

   	booking = _.extend(booking, req.body);

   	booking.save(function(err) {
   		if (err) {
   			return res.status(400).send({
          message: "400 Error"
   			});
   		} else {
   			res.json(booking);
   		}
   	});
 };


/**
 * Delete an ServiceProvider
 */
exports.delete = function(req, res) {
   	var booking = req.booking;

   	booking.remove(function(err) {
   		if (err) {
   			return res.status(400).send({
          message: "400 Error"
   			});
   		} else {
   			res.json(booking);
   		}
   	});
 };

/**
 * List of ServiceProviders
 */
exports.list = function(req, res) {
    Booking.find().exec(function(err, booking) {
        if (err) {
            return res.status(400).send({
              message: "400 Error"
            });
        } else {
            res.json(booking);
        }
    });
};

/**
 * Category middleware
 */
exports.bookingByID = function(req, res, next, id) {
  	if (!mongoose.Types.ObjectId.isValid(id)) {
  		return res.status(400).send({
  			message: 'Booking is invalid!'
  		});
  	}

  	Booking.findById(id).exec(function(err, booking) {
  		if (err) return next(err);
  		if (!booking) {
  			return res.status(404).send({
    				message: 'Booking not found!'
    			});
  		}
  		req.booking = booking;
  		next();
  	});
};
