// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
//console.log("Environment Variables:", process.env);
const postsRouter = require('./routes/posts'); // Ensure this path is correct

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
console.log("MongoDB URI:", process.env.DB_URL); // or process.env.MONGO_URI if you changed it
mongoose.connect("mongodb+srv://pallajaswanthroyal:Eren7674905380@cluster0.clgh2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Define the API endpoint for posts
app.use('/api/posts', postsRouter);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Community Forum API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
