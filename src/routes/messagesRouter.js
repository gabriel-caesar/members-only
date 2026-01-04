const { Router } = require('express');
const controller = require('../controllers/messagesController');

const messagesRouter = Router();

messagesRouter.get('/create', controller.createMessageGet);
messagesRouter.post('/create', controller.createMessagePost);
messagesRouter.get('/edit/:id', controller.editMessageGet);
messagesRouter.post('/edit/:id', controller.editMessagePost);
messagesRouter.post('/delete/:id', controller.deleteMessagePost);
messagesRouter.get('/delete/:id', (req, res) => res.redirect('/'));

// # Handling the blank '/messages' route
messagesRouter.get('/', (req, res) => res.redirect('/'));

module.exports = messagesRouter;
