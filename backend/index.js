const express = require('express');
const userRoutes = require('./routes/userRoutes');
const connectDatabase = require('./utils/db'); // Import the database module
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to the database
connectDatabase();

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});