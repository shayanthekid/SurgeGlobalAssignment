const { Storage } = require('@google-cloud/storage');
const Post = require('../models/Posts');
const Likes = require('../models/Likes');
const multer = require('multer');
const admin = require('firebase-admin');
const storage = new Storage();

const serviceAccount = require('../utils/firebaseconfig');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'surge-8fe27.appspot.com',
});
const bucket = admin.storage().bucket();
const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

const uploadImageToFirebase = async (req, res) => {
    try {
        const image = req.file;
        const imageName = `images/${Date.now()}-${image.originalname}`;
        const file = bucket.file(imageName);
        const imageBuffer = Buffer.from(image.buffer, 'base64');
        await file.save(imageBuffer, {
            metadata: { contentType: image.mimetype },
        });

        res.send({
            status: "Success",
            url: `gs://${bucket.name}/${imageName}`
        })
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

const createPost = async (req, res) => {
    try {
        const { image, userId } = req.body;

        // Upload image to Firebase Storage
        const imageURI = await uploadImageToFirebase(image, userId);

        // Create a new post
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
    uploadImageToFirebase
};
