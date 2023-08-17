const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sajid:TMAK8G4FfjL0k1Or@surge.r40ktlo.mongodb.net/test";

const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectDatabase;