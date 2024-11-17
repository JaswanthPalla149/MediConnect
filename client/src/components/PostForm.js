import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import './PostForm.css';
const url = process.env.REACT_APP_BACKURL;
const PostForm = ({ username, domain, id }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // If necessary, retrieve username and domain from localStorage
    useEffect(() => {
        console.log('In create Posts');
        const storedUsername = localStorage.getItem('username'); // Or sessionStorage.getItem('username')
        const storedDomain = localStorage.getItem('domain');
        const storedId = localStorage.getItem('id');

        if (storedUsername && storedDomain) {
            console.log(`Posting as: ${storedUsername}`);
            console.log(`Domain: ${storedDomain}`);
            console.log(`Also Id: ${storedId}`);
        } else {
            console.log('No username or domain found');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = { title, content, username, domain };

        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await fetch(`${url}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                const createdPost = await response.json();
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
        <div className="post-form-container" style = {{marginTop:'5rem'}}>
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
