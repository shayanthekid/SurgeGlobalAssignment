const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');

router.post('/like/:postId', likesController.createLike);

module.exports = router;