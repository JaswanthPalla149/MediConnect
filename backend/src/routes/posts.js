import { Router } from 'express';
import { Types } from 'mongoose';
import { Post } from '../models/Post.js';

const router = Router();

// GET: Fetch Post by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid
        if (!Types.ObjectId.isValid(id)) {
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
    const { title, content, username, domain } = req.body;
    console.log(`Request body: ${req.body}`);

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const newPost = new Post({ title, content, domain, author: username });
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
        const { id } = req.params;

        // Check if the ID is valid
        if (!Types.ObjectId.isValid(id)) {
            console.log('Invaild PostId format');
            return res.status(400).json({ message: 'Invalid post ID format' });
        }

        // Find the post by ID and increment likes
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.likes += 1;
        await post.save();

        res.status(200).json({ message: 'Post liked successfully', likes: post.likes });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Error liking post', error });
    }
});

// Unlike a post
router.post('/:id/unlike', async (req, res) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            console.log('Invaild PostId format');
            return res.status(400).json({ message: 'Invalid post ID format' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes > 0) {
            post.likes -= 1;
            await post.save();
        }

        res.status(200).json({ message: 'Post unliked successfully', likes: post.likes });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ message: 'Error unliking post', error });
    }
});

// Add a comment to a post
router.post('/:id/comment', async (req, res) => {
    const { username, content } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({ username, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send(error);
    }
});

// DELETE: Delete a comment from a post
router.delete('/:postId/comments/:commentId', async (req, res) => {
    const { postId, commentId } = req.params;

    try {
        // Check if the post ID is valid
        if (!Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID format' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the index of the comment to be deleted
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove the comment from the comments array
        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully', comments: post.comments });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment', error });
    }
});

export { router as postsRouter };
