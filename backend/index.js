const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection setup using Mongoose
const MONGODB_URI = "mongodb+srv://sajid:TMAK8G4FfjL0k1Or@surge.r40ktlo.mongodb.net/test";
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Use user routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
