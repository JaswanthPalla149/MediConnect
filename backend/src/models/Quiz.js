const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizId: { type: String, required: true, unique: true },  
    title: { type: String, required: true },                 
    domain: { type: String, required: true },               

    questions: [
        {
            questionText: { type: String, required: true },  
            options: [                                       
                { type: String, required: true }
            ],
            correctAnswer: { type: String, required: true }  
        }
    ],

    participantsCount: { type: Number, default: 0 },          
    createdAt: { type: Date, default: Date.now },             
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;