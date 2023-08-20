const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/postsController');
// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add', postController.createPost);
router.post('/addImg', upload.single("filename"), postController.uploadImageToFirebase);
router.get('/getAll', postController.getPosts);
module.exports = router;