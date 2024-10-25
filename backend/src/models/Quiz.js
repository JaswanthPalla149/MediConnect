const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizId: { type: String, required: true, unique: true },  // Unique ID for each quiz
    title: { type: String, required: true },                 // Title or name of the quiz
    domain: { type: String, required: true },                // Category (e.g., Anxiety, Mindfulness, Relationships)

    questions: [
        {
            questionText: { type: String, required: true },  // Question content
            options: [                                        // List of answer choices
                { type: String, required: true }
            ],
            correctAnswer: { type: String, required: true }  // Store correct answer for scoring purposes
        }
    ],

    participantsCount: { type: Number, default: 0 },          // Tracks the number of users who took this quiz
    createdAt: { type: Date, default: Date.now },             // Timestamp when the quiz was created
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
