const LocalStrategy = require('passport-local');
const passport = require('passport');
const pool = require('./db/pool');
const bcrypt = require('bcryptjs');

// ### Strategy Configuration ###

const customFields = {
  // → tells passport to understand that `username === email` in the verifyCallback() function
  usernameField: 'email',
  passwordField: 'password',
};

const verifyCallback = async (username, password, done) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      username,
    ]);
    const user = rows[0];

    if (!user) {
      return done(null, false, { message: `Incorrect email.` });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return done(null, false, { message: `Incorrect password` });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

// put user into the session
passport.serializeUser((user, done) => {
  // serializes the user id into the user's session cookie
  done(null, user.id);
});

// get user from the session
passport.deserializeUser(async (id, done) => {
  // this function uses the user id provided by serializeUser() to attach the user object
  // into the request object of all middlewares being executed in the current session
  try {
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// https://www.youtube.com/watch?v=xMEOT9J0IvI&list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK&index=5
// 30 min
