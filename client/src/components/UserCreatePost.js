import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import './UserCreatePost.css';

const UserCreatePost = ({ username, id }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedId = localStorage.getItem('id');

        if (storedUsername) {
            console.log(`Posting as: ${storedUsername}`);
            console.log(`Also Id: ${storedId}`);
        } else {
            console.log('No username found');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDomain) {
            setError('Please select a domain');
            return;
        }

        const newPost = { title, content, username, domain: selectedDomain };

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
                await response.json();
                setTitle('');
                setContent('');
                setSelectedDomain('');
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
                <Form.Group>
                    <Form.Select
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        required
                        className="form-input"
                    >
                        <option value="">Select Domain</option>
                        <option value="mindfulness">Mindfulness</option>
                        <option value="engagement">Engagement</option>
                        <option value="happiness">Happiness</option>
                    </Form.Select>
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

export default UserCreatePost;
