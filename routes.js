"use strict";

exports = module.exports = function(app) {
    /* GET angular partials files */
    app.route('/partial/:name(*)')
    .get(function (req, res) {
        "use strict";

        var name = req.params.name;
        res.render('partials/' + name);
    });

    // Insert routes below
    app.use('/api/photos', require('./app/api/photo'));
    app.use('/api/albums', require('./app/api/album'));
    // app.use('/api/users', require('./api/user'));

    // app.use('/auth', require('./auth').default);

    // All undefined asset or api routes should return a 404
    // app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    // .get(errors[404]);

    // All other routes should redirect to the home
    app.route('/*')
    .get((req, res) => {
        "use strict";

        res.render('index', {title: 'Photo Manager'});
    });
};
