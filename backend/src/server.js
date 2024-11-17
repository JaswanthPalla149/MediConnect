const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
//console.log("Environment Variables:", process.env);
const postsRouter = require('./routes/posts'); 
const quizzesRouter = require('./routes/quizzes');
const usersRouter = require('./routes/users');
const adminsRouter = require('./routes/admins');
const { execFile } = require('child_process');
const path = require('path'); 

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your React app's URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// MongoDB connection
console.log("MONGO_DB_URL:",process.env.DB_URL )
mongoose.connect(process.env.DB_URL
    , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Define the API endpoint for posts and quizzes
app.use('/api/posts', postsRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/users', usersRouter);
app.use('/api/admins', adminsRouter);

app.post('/api/chat', (req, res) => {
    const text = req.body.text;
    const serverPyPath = path.join(__dirname, 'routes', 'ChatServer.py');

    execFile('python', [serverPyPath, text], (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Python script:', error);
            return res.status(500).json({ error: 'Failed to generate response' });
        }

        if (stderr) {
            console.error('Python script error output:', stderr);
        }

        try {
            const response = JSON.parse(stdout);
            res.json(response);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Invalid JSON response from Python script' });
        }
    });
});
app.post('/api/sentiment', (req, res) => {
    const text = req.body.text;
   // console.log(text);
    // Run the Python script as a child process
    const path = require('path');
const serverPyPath = path.join(__dirname, 'routes', 'server.py');
execFile('python', [serverPyPath, text], (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Python script:', error);
            return res.status(500).json({ error: 'Failed to analyze sentiment' });
        }

        if (stderr) {
            console.error('Python script error output:', stderr);
        }

        // Parse and send the Python script output
        const sentimentScores = JSON.parse(stdout);
        res.json(sentimentScores);
    });
});

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