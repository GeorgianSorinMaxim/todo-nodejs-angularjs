var mongoose = require( 'mongoose' );
var Booking  = mongoose.model( 'Booking' );

exports.create = function ( req, res ){
  new Booking({
    content    : req.body.content,
    updated_at : Date.now()
  }).save( function( err, booking, count ){
    res.redirect( '/' );
  });
};

exports.index = function ( req, res ){
  Booking.find( function ( err, bookings, count ){
    res.render( 'index', {
      title : 'Express Todo Example',
      bookings : bookings
    });
  });
};
