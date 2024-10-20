import React, { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';

const PostForm = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = { title, content };

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
                onPostCreated(createdPost);
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
        <Container className="my-4">
            <h2>Create a New Post</h2>
            {loading && <Alert variant="info">Creating post...</Alert>} {/* Loading message */}
            {error && <Alert variant="danger">{error}</Alert>} {/* Error message */}
            {successMessage && <Alert variant="success">{successMessage}</Alert>} {/* Success message */}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Post Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Post Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>Create Post</Button> {/* Disable button when loading */}
            </Form>
        </Container>
    );
};

export default PostForm;
