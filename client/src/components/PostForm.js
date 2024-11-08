import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import './PostForm.css'; 

const PostForm = ({ username/*, onPostCreated */}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => {
        console.log('In create Posts');
        // Retrieve the stored username (from localStorage, sessionStorage, or context)
        const username = localStorage.getItem('username'); // Or sessionStorage.getItem('username')
        
        
        if (username) {
            console.log(`Posting as: ${username}`);
        }
        else{
            console.log('no username given');
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = { title, content, username};

        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                const createdPost = await response.json();
               // onPostCreated(createdPost);
                setTitle('');
                setContent('');
                setSuccessMessage('Post created successfully!');
            } else {
                throw new Error('Failed to create post');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-form-container">
            <h2>Create a New Post</h2>
            {loading && <Alert variant="info">Creating post...</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit} className="post-form">
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Post Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Post Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading} 
                    className="submit-button"
                >
                    Create Post
                </Button>
            </Form>
        </div>
    );
};

export default PostForm;
