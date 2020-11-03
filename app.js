var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

var session = require('express-session');
var MySQLStore = require('express-mysql-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./routes/accountRouter');
var siteRouter = require('./routes/siteRouter');
var serverRouter = require('./routes/serverRouter');
var sensorRouter = require('./routes/sensorRouter');


var app = express();
var dbconfig = require('./routes/config/database');

var sessionStore = new MySQLStore(dbconfig.operation);
app.use(session({
  secret: "asdfasdfdas",
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

// view engine setup

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/account', accountRouter);
app.use('/site', siteRouter);
app.use('/server', serverRouter);
app.use('/sensor', sensorRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
