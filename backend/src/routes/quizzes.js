const express = require('express');
const Quiz = require('../models/Quiz'); 
const mongoose = require('mongoose');
const router = express.Router();

// GET: Fetch all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 }); // Latest first
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error });
    }
});

// GET: Fetch Quiz by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID format is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid quiz ID format' });
        }

        // Find the quiz by ID
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz by ID:', error);
        res.status(500).json({ message: 'Error fetching quiz', error });
    }
});
// POST: Create a new quiz 
router.post('/', async (req, res) => {
    try {
        const { title, domain, questions } = req.body;

        if (!title || !domain || !questions) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        

        const newQuiz = new Quiz({ title, domain, questions });
        await newQuiz.save();
        res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
    } catch (error) {
        console.error('Error details:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error creating quiz', error });
    }
});

// DELETE: Delete a quiz by ID (Optional for admin cleanup)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz', error });
    }
});

module.exports = router;
