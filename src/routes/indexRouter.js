const { Router } = require('express');
const controller = require('../controllers/indexController');

const indexRouter = Router();

indexRouter.get('/', controller.mainPageGet);
indexRouter.get('/sign-up', controller.signupPageGet);
indexRouter.post('/sign-up', controller.signupPagePost);

module.exports = indexRouter;