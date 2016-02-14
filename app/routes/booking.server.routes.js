'use strict';

module.exports = function(app) {
    var bookings = require('../controller/booking.server.controller');
    var users = require('../controller/users.server.controller');


    app.route('/bookings')
       .get(bookings.list)
       .post(bookings.create);

     // The spID param is added to the params object for the request
     app.route('/bookings/:bookingId')
        .get(users.requiresLogin, bookings.read)
        .put(users.requiresLogin, bookings.update)
        .delete(users.requiresLogin, bookings.delete);

      app.get('/booking/create', function(req, res) {
        res.render('create.ejs', {
           booking: bookings.list
        });
      });

      app.param('bookingId', bookings.bookingByID);
};
