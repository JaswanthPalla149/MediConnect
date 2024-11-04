import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';


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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            marginTop: '-50px' // Move it slightly upwards from the center
        }}>
            <h2 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#333' }}>Create a New Post</h2>
            {loading && <Alert variant="info">Creating post...</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit} style={{ width: '400px' }}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Post Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ height: '50px', fontSize: '16px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }} // Added border and border-radius for smoothness
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
                        style={{ height: '120px', fontSize: '16px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }} // Added border and border-radius
                    />
                </Form.Group>
                <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        fontSize: '18px', 
                        borderRadius: '5px', // Smooth corners
                        border: 'none', // Remove default border
                        backgroundColor: '#007bff', // Primary color
                        color: '#fff', // Text color
                        transition: 'background-color 0.3s ease, transform 0.2s ease', // Smooth transition
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'} // Change color on hover
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'} // Reset color
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95'} // Slightly scale down on click
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale
                >
                    Create Post
                </Button>
            </Form>
        </div>
    );
};

export default PostForm;
