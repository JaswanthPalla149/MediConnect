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

        res.json({ token, role: 'user', message: 'Login successful', location: user.location });
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
