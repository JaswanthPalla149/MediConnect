const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    domain: { type: String, required: true },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [
                {
                    text: { type: String, required: true },
                    points: { type: Number, required: true },
                },
            ],
        },
    ],
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
