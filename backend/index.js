const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const connectDatabase = require('./utils/db'); // Import the database module

const app = express();
const PORT = process.env.PORT || 5000;

const allowlist = ['http://127.0.0.1:5173'];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true, credentials: true };
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate)); // Apply CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDatabase();

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
