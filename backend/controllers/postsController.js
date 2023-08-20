const {
    Storage
} = require('@google-cloud/storage');
const Post = require('../models/Posts');
const Likes = require('../models/Likes');
const multer = require('multer');
const admin = require('firebase-admin');
const userController = require('./userController');
const storage = new Storage();
const serviceAccount = require('../utils/firebaseconfig');
const {
    getLikeCountForPost
} = require('./likesController');


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
            metadata: {
                contentType: image.mimetype
            },
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
        res.status(500).json({
            error: 'Error uploading image'
        });
    }
};


// const pageSize = 10; // Set the number of posts per page
// const skip = (page - 1) * pageSize; // Calculate the number of posts to skip

// // Calculate the total count of posts
// const totalPostsCount = await Post.countDocuments();

// // Retrieve paginated posts and order them by date created in descending order
// const posts = await Post.find()
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(pageSize)
//     .populate('userId', 'username'); // Populate the 'userId' field with 'username'

// //populate Likes field with likecount
// const postsWithLikeCount = await Promise.all(posts.map(async (post) => {
//     const likeCount = await getLikeCountForPost(post._id);
//     return {
//         ...post.toObject(),
//         likeCount,
//     };
// }));

const getPosts = async (req, res) => {
    try {
        const {
            page = 1, limit = 10
        } = req.query; // Get the requested page number from the query parameter

        let token = req.header('Authorization')
        token = token?.split(' ')[1]

        // if the token is not found
        if (!token) return res.status(401).send({
            error: "TokenNotFound",
            message: "Token not found"
        })

        // verify the token
        const decoded = userController.verifyJWToken(token)

        // if the token is invalid
        if (!decoded) return res.status(401).send({
            error: "InvalidToken",
            message: "Invalid token"
        })

        // get the userid from the decoded token
        const {
            id: userId
        } = decoded

        // pagination
        const total = await Post.countDocuments(
            // userId ? { userId } : {}
        )
        const hasNextPage = (page * limit) < total;

        const posts = await Post.find()
            .sort({
                createdAt: -1
            })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('userId', 'username') // Populate the 'userId' field with 'username'
            // .toArray(); 

        res.status(200).json({
            data: posts,
            count: posts.length,
            total,
            page: parseInt(page),
            hasNextPage,
        });
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const createPost = async (req, res) => {
    try {
        let token = req.header('Authorization')
        token = token?.split(' ')[1]

        // if the token is not found
        if (!token) return res.status(401).send({
            error: "TokenNotFound",
            message: "Token not found"
        })

        // get the imageURL and description from the request body
        const {
            imageURI,
            description
        } = req.body;

        if (!imageURI) return res.status(400).send({
            error: "ImageURLNotFound",
            message: "ImageURL not found"
        })
        if (!description) return res.status(400).send({
            error: "DescriptionNotFound",
            message: "Description not found"
        })

        // verify the token
        const decoded = userController.verifyJWToken(token)

        // if the token is invalid
        if (!decoded) return res.status(401).send({
            error: "InvalidToken",
            message: "Invalid token"
        })

        // get the userid from the decoded token
        const {
            id
        } = decoded
        try {
            const data = {
                imageURI: imageURL,
                userId: id,
                description
            }

            // Create a new post
            const newPost = new Post({
                ...data,
                likes: []
            });

            const savedPost = await newPost.save();
            if (savedPost) res.status(201).json({
                post: savedPost
            });
            else res.status(400).json({
                error: 'Error creating post'
            });

            // // Create a like for the newly created post and user
            // const savedLike = await createLike(savedPost._id, id);
            // if (savedLike) res.status(201).json({ post: savedPost, like: savedLike });
            // else res.status(400).json({ error: 'Like already exists for this post' });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};



module.exports = {
    createPost,
    uploadImageToFirebase,
    getPosts
};