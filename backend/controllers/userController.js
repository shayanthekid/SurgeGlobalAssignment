const { sign } = require("jsonwebtoken");
const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        // Save the new user
        const savedUser = await newUser.save();

        // The savedUser object will have the generated _id
        const generatedId = savedUser._id;
        console.log('Generated ID:', generatedId);
        const token =createAccessToken(generatedId);
        const now = new Date(); // Get the current time
        const expiration = new Date(now.getTime() + 10 * 60 * 1000);
        res.status(201).json({
            message: 'User registered successfully', token: token, now: now, expiresIn: expiration, authUserState: savedUser   });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createAccessToken = (id) => {
    return sign(
        {  id },
        "dnalskdnaskldn",
        { expiresIn: '10m' }
    );
};

const createRefreshToken = (user) => {
    return sign(
        { userId: id, tokenVersion: user.tokenVersion },
        "ianvavauofcafai",
        { expiresIn: '7d' }
    );
};

const sendRefreshToken = (token, res) => {
    res.cookie(
        'jid', token,
        { httpOnly: true }
    );
};

module.exports = {
    registerUser,
    createAccessToken,
    createRefreshToken,
    sendRefreshToken
};
