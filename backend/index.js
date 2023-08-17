const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());


const uri = "mongodb+srv://sajid:TMAK8G4FfjL0k1Or@surge.r40ktlo.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);


// // MongoDB connection setup
// const MONGODB_URI = 'your-mongodb-uri'; // Replace with your MongoDB connection URI
// mongoose.connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// // Routes
// app.post('/register', async (req, res) => {
//     try {
//         // Handle user registration logic here
//         const { username, email, password } = req.body;
//         // Create a new user instance and save it to the database
//         // Replace this with your actual user registration logic using Mongoose
//         // Example:
//         // const newUser = new User({ username, email, password });
//         // await newUser.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
