const express = require('express');
const Joi = require('joi');
const Admin = require('../models/admin'); 
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const loginSchema = Joi.object({
    adminId: Joi.string().required(),
    password: Joi.string().required()
});
// Admin login route
router.post('/login', async (req, res) => {
    console.log('Received login data:', req.body);
    
    // Validate input with Joi
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Invalid admin ID format' });
    }

    const { adminId, password } = req.body;

    try {
        // Find admin by ID
        const admin = await Admin.findOne({ adminId });
        console.log("Admin lookup result:", admin);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin ID Dude' });
        }

        // Verify the password
        if (admin.password !== password) {
            return res.status(401).json({ message: 'Invalid admin ID or password Dude' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: admin._id, role: 'admin', domain: admin.domain },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: 'admin', message: 'Login successful', domain: admin.domain, _id: admin._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// GET: Fetch all Admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find().sort({ createdAt: -1 }); 
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error });
    }
});

// GET: Fetch Admin by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID format is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Admin ID format' });
        }

        // Find the user by ID
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json(admin);
    } catch (error) {
        console.error('Error fetching admin by ID:', error);
        res.status(500).json({ message: 'Error fetching admin', error });
    }
});

// DELETE: Delete an admin by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the admin by ID and delete it
        const deletedAdmin = await Admin.findByIdAndDelete(id);

        // Check if the admin was found and deleted
        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin by ID:', error);
        res.status(500).json({ message: 'Error deleting admin', error });
    }
});

// POST: Create a new admin
router.post('/', async (req, res) => {
    try {
        const { adminId, password, domain } = req.body;

        // Check for all required fields
        if (!adminId || !password || !domain) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the adminId already exists
        const existingAdmin = await Admin.findOne({ adminId });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin ID already taken' });
        }

        const newAdmin = new Admin({ adminId, password, domain });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        console.error('Error details:', error); 
        res.status(500).json({ message: 'Error creating Admin', error });
    }
});

module.exports = router;
