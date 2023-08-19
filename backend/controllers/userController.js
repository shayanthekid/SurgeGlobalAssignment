const { sign,verify } = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
      //hashes the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
      
        await newUser.save();
        // Save the new user
        const savedUser = await newUser.save();

        // The savedUser object will have the generated _id
        const generatedId = savedUser._id;
        console.log('Generated ID:', generatedId);
        //Generate a new token
        const token =createAccessToken(generatedId);
        const now = new Date(); // Get the current time
        const expiration = 10080;
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

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate an access token and send it in the response
        const token = createAccessToken(user._id);
        const now = new Date(); // Get the current time
        const expiration = 10080;
        res.status(201).json({
            message: 'User Login success', token: token, now: now, expiresIn: expiration, authUserState: user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
 const verifyJWToken = (token) => {
    try {
        const decoded = verify(token, "dnalskdnaskldn")
        return decoded
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    registerUser,
    createAccessToken,
    loginUser,
    verifyJWToken
};
