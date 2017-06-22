var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var index = require('./routes/index');
//var users = require('./routes/users');

var app = express();

//creating a new route
var wartech = require('./routes/wartech');
app.use('/wartech', wartech);


/*
var kitty = new Blogger({ blogger: 'test',
    facebook: 'ttt',
    instagram: 'ss',
    twtter: 'fff',
    instagramid: 34234,
    url: 'Zildjian' });

kitty.save();
*/

// This is where I added first stuff
//loads mongoose package
//var mongoose = require('mongoose');
//Use of native Node primises
//mongoose.Promise = global.Promise;
//connect to MongoDB
//mongoose.connect('mongodb://127.0.0.1:27017/wartech-app').then(() => console.log('connection succesful')).catch((err) => console.error(err));


// Settng up server to use angularjs and bower
app.use(express.static('app'));
	app.use('/bower_components', express.static('bower_components'));

//TO fix the no app engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
//app.set('views','./app');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'app')));


//Not needed atm
//app.use('/', index);
//app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 res.render('error');
 
});



module.exports = app;
