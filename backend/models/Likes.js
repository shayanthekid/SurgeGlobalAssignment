const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
});

const Likes = mongoose.model('Likes', likesSchema);

module.exports = Likes;
