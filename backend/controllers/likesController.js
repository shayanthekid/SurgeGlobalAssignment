const Likes = require('../models/Likes');
const userController = require('./userController');
const Post = require('../models/Posts');

const ObjectId = require('mongoose').Types.ObjectId;

const getLikeCountForPost = async (postId) => {
    try {
        const likeCount = await Likes.countDocuments({ postId });
        return likeCount;
    } catch (error) {
        console.error('Error getting like count:', error);
        return 0; // Return 0 in case of an error
    }
};

// const createLike = async (postId, userId) => {
//     try {
//         // Check if the like already exists for the given post and user
//         const existingLike = await Likes.findOne({ postId, userId });

//         if (existingLike) {
//             // Unlike: Delete the existing like and decrement the like count
//             await Likes.findByIdAndDelete(existingLike._id);
//         } else {
//             // Like: Create a new like
//             const newLike = new Likes({
//                 postId,
//                 userId,
//             });
//             await newLike.save();
//         }

//         // Update the like count for the post
//         const likeCount = await Likes.countDocuments({ postId });

//         // Update the like count in the Post collection
//         await Post.findByIdAndUpdate(postId, { likeCount });

//         return likeCount;
//     } catch (error) {
//         console.error('Error creating/deleting like:', error);
//         return null;
//     }
// };

const createLike = async (req,res) => {
    let token = req.header('Authorization')
    token = token?.split(' ')[1]

    const { postId } = req.params

    if (!token) return res.status(401).send({ error: "TokenNotFound", message: "Token not found" })
    const decodedToken = userController.verifyJWToken(token)
    if (!decodedToken) return res.status(401).send({ error: "Invalid token" })
    console.log(decodedToken);

    const { id: userId } = decodedToken
    if (!userId) return res.status(500).send({ error: "Unable to get user from token" })

    try {
        // Convert the id parameter to ObjectId type
        const objectId = new ObjectId(postId);

        const post = await Post.findOne({ _id: objectId })
        if (!post) return res.status(404).send({ error: "PostNotFound", message: "Post not found" })

        console.log(post);

        let result;
        if (post.likes && post.likes.includes(userId)) {
            // remove the user from the likes array
            await Post.updateOne({ _id: objectId }, { $pull: { likes: userId } })
            result = { message: "Post unliked", currentLikes: post.likes.length - 1 }
        } else {
            // add the user to the likes array
            await Post.updateOne({ _id: objectId }, { $push: { likes: userId } })
            result = { message: "Post liked", currentLikes: post.likes.length + 1 }
        }

        return res.send(result)
    } catch (error) {
        return res.status(500).send({ error: "InternalServer", message: "Internal server error" })
    }

};

module.exports = {
    getLikeCountForPost,
    createLike
};