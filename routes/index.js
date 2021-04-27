var express = require('express');
const { response } = require('../app');
var router = express.Router();

const indexController = require('../controllers/index');

/* GET home page. */
router.get('/', indexController.getIndex);
router.post('/retrieve', indexController.postRetrieveGame);

module.exports = router;
