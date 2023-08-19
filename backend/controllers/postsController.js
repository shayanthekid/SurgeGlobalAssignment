const Post = require('../models/Posts');
const Likes = require('../models/Likes');
const admin = require('firebase-admin');

const serviceAccount = require('../utils/firebaseconfig');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'surge-8fe27.appspot.com',
});

const uploadImageToFirebase = async (req,res) => {
    console.log(req);

    const bucket = admin.storage().bucket();
    const imageName = `images/${Date.now()}.jpg`;
    const file = bucket.file(imageName);

    const imageBuffer = Buffer.from(base64Image, 'base64');
    await file.save(imageBuffer, {
        metadata: { contentType: 'image/jpeg' },
    });
    console.log(req);
    return `gs://${bucket.name}/${imageName}`;
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
