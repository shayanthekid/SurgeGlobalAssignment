const Likes = require('../models/Likes');

const getLikeCountForPost = async (postId) => {
    try {
        const likeCount = await Likes.countDocuments({ postId });
        return likeCount;
    } catch (error) {
        console.error('Error getting like count:', error);
        return 0; // Return 0 in case of an error
    }
};

module.exports = {
    getLikeCountForPost,
};