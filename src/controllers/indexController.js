const { body, validationResult, matchedData } = require('express-validator')

exports.mainPageGet = async (req, res) => {
  res.render('index', { title: 'Home | Members Only' })
};

exports.signupPageGet = async (req, res) => {
  res.render('sign-up', { title: 'Sign Up | Members Only' })
}

exports.signupPagePost = async (req, res) => {
  console.log(req.body)
  res.redirect('/')
}