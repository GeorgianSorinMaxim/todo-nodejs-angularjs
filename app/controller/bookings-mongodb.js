var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

Booking = function(host, port) {
  this.db= new Db('mongodb://admin:fredperry2011@ds039165.mongolab.com:39165/demo', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


Booking.prototype.getCollection= function(callback) {
  this.db.collection('bookings', function(error, bookings) {
    if( error ) callback(error);
    else callback(null, bookings);
  });
};

Booking.prototype.findAll = function(callback) {
    this.getCollection(function(error, bookings) {
      if( error ) callback(error)
      else {
        bookings.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


Booking.prototype.findById = function(id, callback) {
    this.getCollection(function(error, bookings) {
      if( error ) callback(error)
      else {
        bookings.findOne({_id: bookings.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

Booking.prototype.save = function(booking, callback) {
    this.getCollection(function(error, bookings) {
      if( error ) callback(error)
      else {
        if( typeof(booking.length)=="undefined")
          booking = [booking];

        for( var i =0;i< booking.length;i++ ) {
          booking = booking[i];
          booking.created_at = new Date();
          if( booking.comments === undefined ) booking.comments = [];
          for(var j =0;j< booking.comments.length; j++) {
            booking.comments[j].created_at = new Date();
          }
        }

        bookings.insert(booking, function() {
          callback(null, booking);
        });
      }
    });
};

exports.Booking = Booking;
