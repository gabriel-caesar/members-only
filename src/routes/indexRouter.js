const { Router } = require('express');
const controller = require('../controllers/indexController');
const passport = require('passport');

const indexRouter = Router();

indexRouter.get('/', controller.mainPageGet);
indexRouter.get('/sign-up', controller.signupPageGet);
indexRouter.post('/sign-up', controller.signupPagePost);
indexRouter.get('/log-in', controller.loginPageGet);

// ## Log in and log out handlers
indexRouter.post(
  '/log-in',
  passport.authenticate('local', {
    failureRedirect: '/log-in',
    successRedirect: '/',
    failureMessage: 'Invalid credentials',
  })
);
indexRouter.get('/log-out', (req, res) => {
  req.logout((err) => {
    if (!req.user) return res.redirect('/'); // if the user tries to manually enter this route unauthenticated
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// # Not authorized route handler
indexRouter.get('/not-authorized', (req, res) =>
  res.render('not-authorized', { title: 'Not authorized | Members only' })
);

// # Become member route handler
indexRouter.get('/become-member', (req, res) => {
  if (!req.user) return res.status(400).redirect('/not-authorized');
  res.render('become-member', {
    title: 'Become Member | Members only',
    errors: [],
    body: [],
  });
});
indexRouter.post('/become-member', controller.becomeMemberPost);

// # Become admin route handler
indexRouter.get('/become-admin', (req, res) => {
  if (!req.user) return res.status(400).redirect('/not-authorized');
  if (!req.user.member) return res.status(400).redirect('/not-authorized');
  res.render('become-admin', {
    title: 'Become Admin | Members only',
    errors: [],
    body: [],
  });
});
indexRouter.post('/become-admin', controller.becomeAdminPost);
indexRouter.post('/resign', controller.resignPost);

module.exports = indexRouter;
