const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    username: { type: String, required: true, unique: true },

    // Interaction Data (used for dashboard calculation on the frontend)
    interactions: {
        chatbot: [
            {
                message: { type: String, required: true },
                sentimentScore: { type: Number, default: 0 }, // NLP-based sentiment value
                timestamp: { type: Date, default: Date.now }
            }
        ],
        comments: [
            {
                postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
                content: { type: String, required: true },
                sentimentScore: { type: Number, default: 0 }, // NLP-based sentiment
                timestamp: { type: Date, default: Date.now },
                immediateLikes: { type: Number, default: 0 }, // Likes received shortly after posting
            }
        ],
        posts: [
            {
                title: { type: String, required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now }
            }
        ],
        likedPosts: [
            {
                postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true } // Post ID of liked post
            }
        ]
    },

    // Quiz History
    quizScores: [
        {
            quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
            score: { type: Number, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],

    happinessLevel: { type: Number, default: 0.0 },
    mindfulnessLevel: { type: Number, default: 0.0 },
    engagementLevel: { type: Number, default: 0.0 },
    wellnessStatus: { 
        type: String, 
        enum: ['Excellent', 'Good', 'Moderate', 'Needs Attention'], 
        default: 'Moderate' 
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
