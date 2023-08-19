const Post = require('../models/Posts');
const Likes = require('../models/Likes');

const createPost = async (req, res) => {
    try {
        const { imageURI, userId } = req.body;
        const newPost = new Post({
            imageURI,
            userId,
        });

        const savedPost = await newPost.save();

        // Create a like for the newly created post and user
        const savedLike = await createLike(savedPost._id, userId);
        if (savedLike) {
            res.status(201).json({ post: savedPost, like: savedLike });
        } else {
            res.status(400).json({ error: 'Like already exists for this post' });
        }
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createLike = async (postId, userId) => {
    try {
        // Check if the like already exists for the given post and user
        const existingLike = await Likes.findOne({ postId, userId });

        if (existingLike) {
            return null; // Return null to indicate like already exists
        }

        const newLike = new Likes({
            postId,
            userId,
        });

        const savedLike = await newLike.save();
        return savedLike;
    } catch (error) {
        console.error('Error creating like:', error);
        return null;
    }
};

module.exports = {
    createPost,
};
