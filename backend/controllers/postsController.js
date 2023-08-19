const Post = require('../models/Posts');

const createPost = async (req, res) => {
    try {
        const { imageURI, userId } = req.body;
        const newPost = new Post({
            imageURI,
            userId,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createPost,
};
