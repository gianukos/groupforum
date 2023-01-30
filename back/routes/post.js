const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postControl = require('../controllers/posts');
router.post('/create', auth, postControl.createPost);
router.get('/recent/:id', auth, postControl.recentPost);
module.exports = router;