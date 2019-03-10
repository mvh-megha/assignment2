var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

/** API routes */
router.get('/getUsers', (request, response) => { userController.getUsers(request, response) });
router.get('/postsAndComments', (request, response) => { userController.matchPostToComment(request, response) });
/** End of routing */

module.exports = router;