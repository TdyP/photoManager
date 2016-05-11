process.env.APP_PATH = (__dirname);
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// var routes = require('./routes/index');
// var users = require('./routes/users');
// var photos = require('./routes/photos');
// var albums = require('./routes/albums');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/photoManager');
mongoose.connection.on('error', function (err) {
    "use strict";

    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    "use strict";

    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        "use strict";

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    "use strict";

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
