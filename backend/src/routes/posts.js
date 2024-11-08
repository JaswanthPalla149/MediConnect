const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Post = require('../models/Post'); 

// GET: Fetch Post by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID format' });
        }

        // Find the post by ID
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ message: 'Error fetching post', error });
    }
});

// DELETE: Delete a post by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the post by ID and delete it
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post', error });
    }
});
// POST: Create a new post
router.post('/', async (req, res) => {
    const { title, content, username } = req.body;
    console.log(`request body :${req.body}`)
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const newPost = new Post({ title, content, author : username });
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
