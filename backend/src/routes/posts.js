const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); 

// POST: Create a new post
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    const newPost = new Post({ title, content });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Fetch all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Like a post
router.post('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.likes += 1;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a comment to a post
router.post('/:id/comment', async (req, res) => {
    const { username, content } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({ username, content });
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
