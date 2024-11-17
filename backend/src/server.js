import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import { execFile } from 'child_process';
import { join, resolve } from 'path'; // Import both join and resolve
import {postsRouter} from './routes/posts.js';
import {quizzesRouter} from './routes/quizzes.js';
import {usersRouter} from './routes/users.js';
import {adminsRouter} from './routes/admins.js';
import { fileURLToPath } from 'url';
import path from 'path'; 
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config();

const app = express();
app.use(
  cors({
    origin: process.env.FE_URL, // Adjust this to your React app's URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.options('*', cors());
app.use(express.json());

// Fix __dirname for ES modules
//const __dirname = resolve();

// MongoDB connection
console.log('MONGO_DB_URL:', process.env.DB_URL);
connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the API endpoint for posts and quizzes
app.use('/api/posts', postsRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/users', usersRouter);
app.use('/api/admins', adminsRouter);

// Serve static files
/*app.use(express.static(join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'build', 'App.js'));
});*/

app.post('/api/chat', (req, res) => {
  const text = req.body.text;
  const serverPyPath = join(__dirname, 'routes', 'Gem_Ser.py');

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
    const serverPyPath = path.join(__dirname, 'routes', 'server.py');
    execFile('python', [serverPyPath, text], (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Python script:', error);
            return res.status(500).json({ error: 'Failed to analyze sentiment' });
        }

        if (stderr) {
            console.error('Python script error output:', stderr);
        }

        // Log stdout to verify it's valid JSON
        console.log('Python script output:', stdout);

        try {
            // Parse the JSON output from the Python script
            const sentimentScores = JSON.parse(stdout);
            res.json(sentimentScores);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ error: 'Failed to parse sentiment result' });
        }
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
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
