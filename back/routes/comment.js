const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentControl = require('../controllers/comments');
router.post('/comment', auth, commentControl.createComment);
router.get('/comments', auth, commentControl.getComments);
module.exports = router;