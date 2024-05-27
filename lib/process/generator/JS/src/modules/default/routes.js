const { Router } = require('express');
const defaultController = require('./controllers');
const router = Router();

router.get('/', defaultController);

module.exports = router;
