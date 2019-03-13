var express = require('express');
var router = express.Router();
let multer = require('multer');
let upload = multer();


const userController = require('../controllers/userController');

/** API routes */
router.get('/getUsers', (request, response) => { userController.getUsers(request, response) });
router.get('/postsAndComments', (request, response) => { userController.matchPostToComment(request, response) });
router.post('/updateAvatar', upload.single('file'), (request, response) => {
    userController.updateAvatar(request, response)
})
/** End of routing */

module.exports = router;