require("dotenv").config();

const mongoose = require('mongoose');
const User = require("../models/User.js");

const mongoURL = "mongodb+srv://smriti:R8kxN8K5fedXWE7H@cluster0.79arwj7.mongodb.net/CollegeConnect?retryWrites=true&w=majority";

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB.');
        // Update the collection with the 'status' field
        return User.updateMany({}, { $set: { status: 'ACTIVE' } });
    })
    .then((result) => {
        console.log('Documents updated successfully:', result);
    })
    .catch((error) => {
        console.log('Error updating documents:', error);
    })
    .finally(() => {
        // Close the connection
        mongoose.connection.close();
    });
