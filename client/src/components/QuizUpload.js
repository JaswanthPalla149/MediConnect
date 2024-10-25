// src/components/QuizUpload.js
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const QuizUpload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, questions: questions.split('\n') }),
            });

            if (!response.ok) throw new Error('Failed to create quiz');
            setSuccess(true);
            setTitle('');
            setDescription('');
            setQuestions('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Create New Quiz</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Quiz created successfully!</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Questions (one per line)</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        value={questions} 
                        onChange={(e) => setQuestions(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Button type="submit" className="mt-3">Create Quiz</Button>
            </Form>
        </div>
    );
};

export default QuizUpload;