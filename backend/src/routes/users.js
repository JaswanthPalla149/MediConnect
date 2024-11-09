const express = require('express');
const User = require('../models/User'); 
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');

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
        const token = jwt.sign(
            { id: user._id, role: 'user', location: user.location },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: 'user', message: 'Login successful', location: user.location, _id: user._id});
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
        const users = await User.find().sort({ createdAt: -1 }); 
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

router.post('/interactions/like', async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const user = await User.findById(userId);
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
// POST request to add a comment to a user's profile based on their username
router.post('/:username/comments', async (req, res) => {
    const { username } = req.params;  // Extract username from URL
    const { content, postId, sentimentScore } = req.body; // Extract content and postId from the request body

    try {
        // Find the user by their username
        const user = await User.findOne({ username });

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

 if (!user.interactions) {
            user.interactions = {};
        }
        if (!user.interactions.comments) {
            user.interactions.comments = [];
        }

        // Add the comment to the user's comments array
        user.interactions.comments.push({ content, postId, sentimentScore, timestamp: new Date() });

        // Save the user document with the new comment
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'Comment added to user profile' });

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
        const user = await User.findOne({ username });

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
router.delete('/:username/comments/:commentId', async (req, res) => {
    const { username, commentId } = req.params;  // Extract username and commentId from URL

    try {
        // Find the user by their username
        const user = await User.findOne({ username });

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

/*
router.get('/:username', async (req, res) => {
    const { username } = req.params; // Extract the username from the URL

    try {
        // Find the user by their username
        const user = await User.findOne({ username });

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user's comments
        res.status(200).json({ comments: user.interactions.comments });

    } catch (error) {
        console.error('Error fetching comments for user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});*/
// DELETE: Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID and delete it
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// POST: Create a new user 
router.post('/', async (req, res) => {
    console.log('Received login data:', req.body);
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

module.exports = router;
