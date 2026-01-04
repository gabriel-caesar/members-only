const LocalStrategy = require('passport-local');
const session = require('express-session');
const passport = require('passport');
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('node:path');
const indexRouter = require('./routes/indexRouter');
const messagesRouter = require('./routes/messagesRouter.js');
require('dotenv').config();

// setting the express backend up
const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// setting EJS up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// connecting the CSS to the app
const assetsPath = path.join(__dirname, '..', 'public');
app.use(express.static(assetsPath));

// importing passport's config
require('./passport.js');

// setting routes and pages up
app.use('/', indexRouter);
app.use('/messages', messagesRouter);

// handles 404 not found errors
app.use(function(req, res, next) {
    var err = new Error('404 - Not Found');
    err.status = 404;
    next(err);
});

// handling errors
function errorHandler(err, req, res, next) {
  if (err) {
    res.status(err.status || 500);
    res.render('page-error', { 
      title: 'Error | Members only',
      message: err.message === '404 - Not Found' ? err.message : '500 - Internal Server Error',
      error: err
    })
  }
};

app.use(errorHandler);

// initializing the server
const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Running server on localhost:${PORT}`);
});
