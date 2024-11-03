const express = require('express');
const Admin = require('../models/admin'); 
const mongoose = require('mongoose');
const router = express.Router();

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
