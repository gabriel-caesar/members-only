const { body, validationResult, matchedData } = require('express-validator');
const {
  signUpUser,
  getAllMessages,
  turnUserMember,
  turnUserAdmin,
  resignUserAdmin,
} = require('../db/queries');

validateSignUp = [
  body('firstname')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('First Name: min. characters is 4 and max. is 20')
    .matches(/^[a-zA-Z]+(\s{,1}[a-zA-Z]+)?$/)
    .withMessage('First Name: only letters are allowed'),

  body('lastname')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Last Name: min. characters is 4 and max. is 20')
    .matches(/^[a-zA-Z]+(\s{,1}[a-zA-Z]+)?$/)
    .withMessage('Last Name: only letters are allowed')
    .custom(
      (value, { req }) =>
        value.trim().toLowerCase() !== req.body.firstname.trim().toLowerCase()
    )
    .withMessage("Last Name: last name can't match the first name"),

  body('email').isEmail().withMessage('Needs to be an email'),

  body('password')
    .trim()
    .isLength({ min: 12, max: 255 })
    .withMessage('Password needs to be at leats 12 characters long')
    .matches(/^(?=.*\d)(?=.*[(@|#|$|%|^|&|\*)])[a-zA-Z\d@#$%^&*]+$/)
    .withMessage(
      'Password needs to have letters, numbers and at least one special character of the following (@, #, $, %, ^, & or *)'
    ),

  body('confirm_password')
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords don't match"),
];

validateMember = [
  body('answer')
    .trim()
    .custom((value) => value === 'theodinproject')
    .withMessage(
      'You got it wrong, try again. Remember, no casing and no spaces!'
    ),
];

validateAdmin = [
  body('answer')
    .trim()
    .custom((value) => value === '4.14')
    .withMessage(
      'Your answer should look like 3.22, 3.14 or 1.33. Pay attention to the punctuation!'
    ),
];

exports.mainPageGet = async (req, res) => {
  res.render('index', {
    title: 'Home | Members Only',
    user: req.user,
    messages: await getAllMessages(),
  });
};

exports.loginPageGet = async (req, res) => {
  if (req.user) return res.redirect('/'); // if there is an user already logged in, redirect them to home

  res.render('log-in', {
    title: 'Log In | Members Only',
    registered: false,
    invalid: req.session.messages
      ? req.session.messages.find((error) => error === 'Invalid credentials')
      : '',
    body: [],
    errors: [],
  });
};

exports.signupPageGet = async (req, res) => {
  res.render('sign-up', {
    title: 'Sign Up | Members Only',
    errors: [],
    body: [],
  });
};

exports.signupPagePost = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('sign-up', {
        title: 'Sign Up | Members Only',
        errors: errors.array(),
        body: req.body,
      });
    }
    const { firstname, lastname, email, password } = matchedData(req);
    await signUpUser(firstname, lastname, email, password);
    res.redirect('/log-in');
  },
];

exports.becomeMemberPost = [
  validateMember,
  async (req, res) => {
    if (!req.user) return res.status(400).redirect('/not-authorized');

    // error handler
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).render('become-member', {
        title: 'Become Member | Members only',
        errors: errors.array(),
        body: req.body,
      });

    await turnUserMember(req.user.id);
    res.redirect('/');
  },
];

exports.becomeAdminPost = [
  validateAdmin,
  async (req, res) => {
    if (!req.user) return res.status(400).redirect('/not-authorized');
    if (!req.user.member) return res.status(400).redirect('/not-authorized');

    // error handler
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).render('become-admin', {
        title: 'Become Admin | Members only',
        errors: errors.array(),
        body: req.body,
      });

    await turnUserAdmin(req.user.id);
    res.redirect('/');
  },
];

exports.resignPost = async (req, res) => {
  if (!req.user) return res.status(400).redirect('/not-authorized');
  if (!req.user.member) return res.status(400).redirect('/not-authorized');
  await resignUserAdmin(req.user.id);
  res.redirect('/');
};
