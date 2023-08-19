const express = require('express');
const router = express.Router();
const postController = require('../controllers/postsController');

router.post('/add', postController.createPost);
module.exports = router;