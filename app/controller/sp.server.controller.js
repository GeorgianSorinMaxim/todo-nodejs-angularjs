'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ServiceProvider = mongoose.model('ServiceProvider'),
    _ = require('lodash');

/**
 * Create a ServiceProvider
 */
 exports.create = function(req, res) {
     var serviceprovider = new ServiceProvider(req.body);

     serviceprovider.save(function(err) {
         if (err) {
             return res.status(400).send({
                 message: "400 Error"
             });
         } else {
             res.status(201).json(serviceprovider);
         }
     });
 };

/**
 * Show the current ServiceProvider
 */
 exports.read = function(req, res) {
     ServiceProvider.findById(req.params.spID).exec(function(err, serviceprovider) {
         if (err) {
           return res.status(400).send({
                message: "400 Error"
           });
       } else {
          if (!serviceprovider) {
                 return res.status(404).send({
                     message: 'ServiceProvider not found!'
                 });
             }
             res.json(serviceprovider);
       }
     });
 };

 /**
 * Show the current Category
 */
exports.readSecond = function(req, res) {
	  res.json(req.serviceprovider);
};

/**
 * Update a ServiceProvider
 */
 exports.update = function(req, res) {
   	var serviceprovider = req.serviceprovider;

   	serviceprovider = _.extend(serviceprovider, req.body);

   	serviceprovider.save(function(err) {
   		if (err) {
   			return res.status(400).send({
              message: "400 Error"
   			});
   		} else {
   			res.json(serviceprovider);
   		}
   	});
 };


/**
 * Delete an ServiceProvider
 */
exports.delete = function(req, res) {
   	var serviceprovider = req.serviceprovider;

   	serviceprovider.remove(function(err) {
   		if (err) {
   			return res.status(400).send({
   				message: errorHandler.getErrorMessage(err)
   			});
   		} else {
   			res.json(serviceprovider);
   		}
   	});
 };

/**
 * List of ServiceProviders
 */
exports.list = function(req, res) {
    ServiceProvider.find().exec(function(err, serviceproviders) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(serviceproviders);
        }
    });
};

/**
 * Category middleware
 */
exports.spByID = function(req, res, next, id) {
  	if (!mongoose.Types.ObjectId.isValid(id)) {
  		return res.status(400).send({
  			message: 'ServiceProvider is invalid!'
  		});
  	}

  	ServiceProvider.findById(id).exec(function(err, serviceprovider) {
  		if (err) return next(err);
  		if (!serviceprovider) {
  			return res.status(404).send({
    				message: 'ServiceProvider not found!'
    			});
  		}
  		req.serviceprovider = serviceprovider;
  		next();
  	});
};
