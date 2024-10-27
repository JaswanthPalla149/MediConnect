const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid to generate unique IDs

const questionSchema = new mongoose.Schema({
    questionId: { type: String, default: uuidv4 }, // Unique identifier for each question
    questionText: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true },
            points: { type: Number, required: true },
        },
    ],
});

const quizSchema = new mongoose.Schema({
    quizId: { type: String, default: uuidv4 }, // Unique identifier for each quiz
    title: { type: String, required: true },
    domain: { type: String, required: true },
    questions: [questionSchema],
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
