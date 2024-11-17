import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    domain: { type: String, required: true},
    likes: { type: Number, default: 0 }, 
    comments: [commentSchema], 
    author: { type: String, required: true },
}, { timestamps: true });

const Postm = mongoose.model('Post', postSchema);

export { Postm as Post}
