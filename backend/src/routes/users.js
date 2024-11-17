import { Router } from 'express';
import { User } from '../models/User.js';
import { Types } from 'mongoose';
const router = Router();
import jwt from 'jsonwebtoken';
const { sign } = jwt;


// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// POST: User login route
router.post('/login', async (req, res) => {
    console.log('Received login data:', req.body);

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find user by username
        const user = await User.findOne({ username });
        console.log("User lookup result:", user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username Dude' });
        }

        // Verify the password (this assumes the password is stored in plaintext)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password Dude' });
        }

        // Create a JWT token
        const token = sign(
            { id: user._id, role: 'user', location: user.location },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: 'user', message: 'Login successful', location: user.location, _id: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST: User registration route
router.post('/register', async (req, res) => {
    try {
        const { name, email, phoneNumber, password, location, username } = req.body;

        // Check for all required fields
        if (!name || !email || !phoneNumber || !password || !location || !username) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const newUser = new User({ name, email, phoneNumber, password, location, username });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: 'Error creating User', error });
    }
});

// GET: Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }); // Fixed the call to `User.find()`
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// GET: Fetch User by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID format is valid
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Find the user by ID
        const user = await User.findById(id); // Fixed the call to `User.findById()`

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// POST: User interaction - Like a post
router.post('/interactions/like', async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const user = await User.findById(userId);  // Fixed call to `User.findById`
        const isLiked = user.interactions.likedPosts.some(like => like.postId.toString() === postId);

        if (isLiked) {
            // Remove postId if already liked
            user.interactions.likedPosts = user.interactions.likedPosts.filter(
                (like) => like.postId.toString() !== postId
            );
        } else {
            // Add postId if not liked yet
            user.interactions.likedPosts.push({ postId });
        }

        await user.save();
        res.status(200).json({ likedPosts: user.interactions.likedPosts });
    } catch (error) {
        res.status(500).json({ error: 'Error updating like status' });
    }
});

router.post('/:username/quiz', async (req, res) => {
    const { username } = req.params; // Extract username from URL
    const { quizId, score, domain } = req.body; // Include `quizId`, `score`, and `domain` in the request body

    try {
        // Find the user by their username
        const user = await User.findOne({ username });

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize the `quizScores` array if not already set
        if (!user.quizScores) {
            user.quizScores = [];
        }

        // Add the new quiz result to the user's `quizScores` array
        user.quizScores.push({ quizId, score, timestamp: new Date() });

        // Update the domain level directly here
        const currentLevel = user[`${domain}Level`] || 0;

        // Define a smoothing factor (alpha) to control how much weight we give to the new quiz score
        const alpha = 0.3;  // Adjust alpha between 0 and 1 for responsiveness

        // Calculate the new level using a weighted moving average
        const newLevel = (1 - alpha) * currentLevel + alpha * score;

        // Clamp the result between -1 and 1 to ensure it stays within valid range
        user[`${domain}Level`] = Math.min(1, Math.max(-1, newLevel));

        // Save the user document with the new quiz result and updated domain level
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'Quiz result added and domain level updated' });

    } catch (error) {
        console.error('Error adding quiz result to user:', error);
        res.status(500).json({ message: 'Error adding quiz result to user profile', error });
    }
});


// POST request to add a comment to a user's profile based on their username
router.post('/:username/comments', async (req, res) => {
    const { username } = req.params;  // Extract username from URL
    const { content, postId, sentimentScore, domain } = req.body; // Include `domain` in the request body

    try {
        // Find the user by their username
        const user = await User.findOne({ username });  // Fixed call to `User.findOne`

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize the interactions structure if not already set
        if (!user.interactions) {
            user.interactions = {};
        }
        if (!user.interactions.comments) {
            user.interactions.comments = [];
        }

        // Add the comment to the user's comments array
        user.interactions.comments.push({ content, postId, sentimentScore, timestamp: new Date() });

        // Update the domain level directly here
        const currentLevel = user[`${domain}Level`] || 0;

        // Define a smoothing factor (alpha) to control how much weight we give to the new sentiment score
        const alpha = 0.3;  // Adjust alpha between 0 and 1 for responsiveness

        // Calculate the new level using a weighted moving average
        const newLevel = (1 - alpha) * currentLevel + alpha * sentimentScore;

        // Clamp the result between -1 and 1 to ensure it stays within valid range
        user[`${domain}Level`] = Math.min(1, Math.max(-1, newLevel));

        // Save the user document with the new comment and updated domain level
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'Comment added and domain level updated' });

    } catch (error) {
        console.error('Error adding comment to user:', error);
        res.status(500).json({ message: 'Error adding comment to user profile', error });
    }
});

// Route to get comments for a specific user by username
router.get('/:username/comments', async (req, res) => {
    const { username } = req.params; // Extract username from URL

    try {
        // Find the user by their username
        const user = await User.findOne({ username });  // Fixed call to `User.findOne`

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user has no interactions or comments, return an empty array
        const comments = user.interactions?.comments || [];

        // Respond with the comments array
        res.status(200).json({ comments });

    } catch (error) {
        console.error('Error retrieving comments for user:', error);
        res.status(500).json({ message: 'Error retrieving comments', error });
    }
});

// DELETE: Delete a comment by ID
router.delete('/:username/comments/:commentId', async (req, res) => {
    const { username, commentId } = req.params;  // Extract username and commentId from URL

    try {
        // Find the user by their username
        const user = await User.findOne({ username });  // Fixed call to `User.findOne`

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the index of the comment to delete
        const commentIndex = user.interactions?.comments.findIndex(comment => comment._id.toString() === commentId);

        // If the comment is not found, return an error
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove the comment from the comments array
        user.interactions.comments.splice(commentIndex, 1);

        // Save the user document after deleting the comment
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment', error });
    }
});

export { router as usersRouter }
