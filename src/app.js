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

// initializing the server
const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Running server on localhost:${PORT}`);
});
