import React, { useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import './QuizUpload.css'; // Ensure this file exists for styling

const QuizUpload = () => {
    const [title, setTitle] = useState('');
    const [domain, setDomain] = useState('');
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle adding a new question with empty options
    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: [{ text: '', points: 0 }] }]);
    };

    // Handle adding an option to a specific question
    const addOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push({ text: '', points: 0 });
        setQuestions(updatedQuestions);
    };

    // Handle updating question text
    const handleQuestionChange = (qIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].questionText = value;
        setQuestions(updatedQuestions);
    };

    // Handle updating option text or points
    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[oIndex][field] = field === 'points' ? parseInt(value) : value;
        setQuestions(updatedQuestions);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation checks
        if (!title || !domain || questions.length === 0) {
            return setError('All fields are required');
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText || !Array.isArray(q.options) || q.options.length === 0) {
                return setError(`Question ${i + 1} must have text and at least one option.`);
            }

            for (let oIndex = 0; oIndex < q.options.length; oIndex++) {
                const option = q.options[oIndex];
                if (typeof option.text !== 'string' || typeof option.points !== 'number') {
                    return setError(`Option ${oIndex + 1} of Question ${i + 1} must have valid text and points.`);
                }
            }
        }

        try {
            const response = await fetch('http://localhost:5000/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, domain, questions }),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to create quiz');
            }

            setSuccess(true);
            setTitle('');
            setDomain('');
            setQuestions([]);
            setError(null); // Clear any previous errors

        } catch (error) {
            setError(error.message);
        }
    };

    // Reset error messages and form fields
    const handleReset = () => {
        setError(null);
        setTitle('');
        setDomain('');
        setQuestions([]);
        setSuccess(false);
    };

    return (
        <div className="quiz-upload-container">
            <h2>Create New Quiz</h2>
            {error && (
                <Alert variant="danger" className="quiz-upload-alert">
                    {error}
                    <Button variant="link" onClick={handleReset}>Reset</Button>
                </Alert>
            )}
            {success && <Alert variant="success" className="quiz-upload-alert">Quiz created successfully!</Alert>}

            <Form onSubmit={handleSubmit} className="quiz-upload-form">
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-control"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Domain</Form.Label>
                    <Form.Control
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        required
                        className="form-control"
                    />
                </Form.Group>

                <h3>Questions</h3>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="question-container">
                        <Form.Group>
                            <Form.Label>Question {qIndex + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                value={question.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                required
                                className="form-control"
                            />
                        </Form.Group>

                        <h5>Options</h5>
                        {question.options.map((option, oIndex) => (
                            <Row key={oIndex} className="align-items-center mb-2">
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Points"
                                        value={option.points}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'points', e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                </Col>
                            </Row>
                        ))}

                        <Button
                            variant="secondary"
                            onClick={() => addOption(qIndex)}
                            className="mt-2"
                        >
                            Add Option
                        </Button>
                    </div>
                ))}

                <Button variant="primary" onClick={addQuestion} className="mt-3 me-3">
                    Add Question
                </Button>

                <Button type="submit" className="mt-3 btn-success">
                    Create Quiz
                </Button>
            </Form>
        </div>
    );
};

export default QuizUpload;
