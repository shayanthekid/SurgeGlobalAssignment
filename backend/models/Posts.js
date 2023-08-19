const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageURI: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
