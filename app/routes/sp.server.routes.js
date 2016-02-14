'use strict';

module.exports = function(app) {
    var serviceproviders = require('../controller/sp.server.controller');

    app.route('/sp')
       .get(serviceproviders.list)
       .post(serviceproviders.create);

     // The spID param is added to the params object for the request
     app.route('/sp/:spID')
        // .get(serviceproviders.read)
        .put(serviceproviders.update)
        .delete(serviceproviders.delete);


      // app.get('/sp/:spID', function(req, res, next) {
      //   res.send('sp.ejs', {
      //     "serviceproviders" : serviceproviders.read
      //   });
      // });


      // app.get('/provider/:id', function(req, res, next) {
      //   res.render('provider.ejs', {
      //       "serviceproviders" : .serviceproviders
      //   });
      // });

     app.param('spID', serviceproviders.spByID);
};
