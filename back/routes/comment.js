const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { commentPropertyInputs, validate } = require('../middleware/validator');
const commentControl = require('../controllers/comments');
router.post('/comment', commentPropertyInputs(), validate, auth, commentControl.createComment);
router.get('/comments', auth, commentControl.getComments);
module.exports = router;