const { body, validationResult, matchedData } = require('express-validator');
const {
  createMessage,
  getMessage,
  editMessage,
  deleteMessage,
} = require('../db/queries');

const validateMessage = [
  body('title')
    .trim()
    .isLength({ min: 4, max: 15 })
    .withMessage('Title: min. characters is 4 and max. is 15'),

  body('content')
    .trim()
    .isLength({ min: 10, max: 824 })
    .withMessage('Message Text: min. characters is 10 and max. is 824')
    .custom(
      (value, { req }) =>
        req.body.title.trim().toLowerCase() !== value.trim().toLowerCase()
    )
    .withMessage("Message Text: the message text can't be the title"),
];

exports.createMessageGet = async (req, res) => {
  if (!req.user) return res.redirect('/not-authorized');
  res.render('create-new-message', {
    title: 'Create Message | Members Only',
    body: [],
    errors: [],
  });
};

exports.createMessagePost = [
  validateMessage,
  async (req, res) => {
    // if the user tries to post the route not being unauthenticated
    if (!req.user) return res.status(400).redirect('/not-authorized');

    // express validator error handler
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('create-new-message', {
        title: 'Create Message | Members Only',
        body: req.body,
        errors: errors.array(),
      });
    }
    const { title, content } = matchedData(req);
    await createMessage(title, content, req.user.id);
    res.redirect('/');
  },
];

exports.editMessageGet = async (req, res) => {
  const { id } = req.params;

  // if the user tries to access the route not being unauthenticated
  if (!req.user) return res.status(400).redirect('/not-authorized');

  // getting the message
  const message = await getMessage(id);

  // if the message doesn't exists
  if (!message) throw new Error(`Message not found from front-end`);

  // if the user is authenticated but not authorized to access the desired content
  if (message.user_id !== req.user.id)
    return res.status(400).redirect('/not-authorized');

  // rendering the HTML
  res.render('edit-message', {
    title: `Edit ${message.title}`,
    message: message,
    errors: [],
    body: [],
  });
};

exports.editMessagePost = [
  validateMessage,
  async (req, res) => {
    // getting the message id
    const { id } = req.params;

    // if the user tries to post the route not being unauthenticated
    if (!req.user) return res.status(400).redirect('/not-authorized');

    // getting the message
    const message = await getMessage(id);

    // if the message doesn't exists
    if (!message) throw new Error(`Message not found from front-end`);

    // if the user is authenticated but not authorized to access the desired content
    if (message.user_id !== req.user.id)
      return res.status(400).redirect('/not-authorized');

    // express validator error handler
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('edit-message', {
        title: `Edit ${message.title}`,
        message: message,
        errors: errors.array(),
        body: req.body,
      });
    }

    const { title, content } = matchedData(req);
    await editMessage(title, content, req.user.id, message.id);
    res.redirect('/');
  },
];

exports.deleteMessagePost = async (req, res) => {
  if (!req.user) return res.status(400).redirect('/not-authorized');
  if (!req.user.member) return res.status(400).redirect('/not-authorized');
  const { id } = req.params;
  console.log(id);
  await deleteMessage(id);
  res.redirect('/');
};
