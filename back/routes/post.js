const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { postPropertyInputs, validate } = require('../middleware/validator');
const postControl = require('../controllers/posts');
router.post('/create', postPropertyInputs(), validate, auth, postControl.createPost);
router.get('/recent/:id', auth, postControl.recentPost);
router.get('/posts/', auth, postControl.allPosts);
router.get('/before/:id', auth, postControl.unread);
router.get('/image', auth, postControl.getFile);
router.put('/after/:id', auth, postControl.wasRead)
module.exports = router;