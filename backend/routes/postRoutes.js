const express = require('express');
const router = express.Router();
const postController = require('../controllers/postsController');

router.post('/add', postController.createPost);
router.post('/addimg', postController.uploadImageToFirebase);
module.exports = router;