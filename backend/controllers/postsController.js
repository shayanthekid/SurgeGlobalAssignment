const { Storage } = require('@google-cloud/storage');
const Post = require('../models/Posts');
const Likes = require('../models/Likes');
const multer = require('multer');
const admin = require('firebase-admin');
const userController = require('./userController');
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

        // Get the signed URL for the uploaded image
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', // Adjust the expiration date as needed
        });

        res.send({
            status: "Success",
            url: url
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
};

const createPost = async (req, res) => {
    try {
        let token = req.header('Authorization')
        token = token?.split(' ')[1]

        // if the token is not found
        if (!token) return res.status(401).send({ error: "TokenNotFound", message: "Token not found" })

        // get the imageURL and description from the request body
        const { imageURL, description } = req.body;

        if (!imageURL) return res.status(400).send({ error: "ImageURLNotFound", message: "ImageURL not found" })
        if (!description) return res.status(400).send({ error: "DescriptionNotFound", message: "Description not found" })

        // verify the token
        const decoded = userController.verifyJWToken(token)

        // if the token is invalid
        if (!decoded) return res.status(401).send({ error: "InvalidToken", message: "Invalid token" })

        // get the userid from the decoded token
        const { id } = decoded
        try {
            const data = {
                imageURI: imageURL,
                userId: id,
                description
            }

            // Create a new post
            const newPost = new Post(data);

            const savedPost = await newPost.save();
            if (savedPost) res.status(201).json({ post: savedPost });
            else res.status(400).json({ error: 'Error creating post' });

            // // Create a like for the newly created post and user
            // const savedLike = await createLike(savedPost._id, id);
            // if (savedLike) res.status(201).json({ post: savedPost, like: savedLike });
            // else res.status(400).json({ error: 'Like already exists for this post' });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Internal server error' });
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
