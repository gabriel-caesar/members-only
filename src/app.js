const LocalStrategy = require('passport-local');
const session = require('express-session');
const passport = require('passport');
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('node:path');
require('dotenv').config();

// setting the express backend up
const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// setting EJS up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setting passport up
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // getting the user logged in
    } catch (error) {
      return done(error)
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {

  } catch (error) {
    done(error)
  }
});

// setting routes and pages up
app.use('/', indexRouter);

// initializing the server
const PORT = 3000;
app.listen(PORT, error => {
  if (error) throw error;
  console.log(`Running server on localhost:${PORT}`);
})