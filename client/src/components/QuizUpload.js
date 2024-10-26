import React, { useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';

const QuizUpload = () => {
    const [title, setTitle] = useState('');
    const [domain, setDomain] = useState(''); // State for domain
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
        // Log current state values before submission
        console.log('Submitting quiz with the following details:');
        console.log('Title:', title);
        console.log('Domain:', domain);
        console.log('Questions:', questions);
    
        // Ensure questions are formatted correctly
        if (!Array.isArray(questions) || questions.length === 0) {
            console.error('Questions array is empty or not an array.');
            return setError('Questions must be an array with at least one question.');
        }
    
        // Check each question's structure
        questions.forEach((q, index) => {
            if (!q.questionText || !Array.isArray(q.options) || q.options.length === 0) {
                console.error(`Question ${index + 1} is missing required fields.`);
                setError(`Question ${index + 1} must have text and at least one option.`);
                return;
            }
    
            q.options.forEach((option, oIndex) => {
                if (typeof option.text !== 'string' || typeof option.points !== 'number') {
                    console.error(`Option ${oIndex + 1} of Question ${index + 1} is invalid.`);
                    setError(`Option ${oIndex + 1} of Question ${index + 1} must have valid text and points.`);
                    return;
                }
            });
        });
    
        try {
            // Send the POST request to create a new quiz
            const response = await fetch('http://localhost:5000/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, domain, questions }),
            });
    
            // Debugging: Log the response status and body
            console.log('Response status:', response.status);
    
            const responseData = await response.json();
            if (!response.ok) {
                console.error('Error details:', responseData);
                throw new Error('Failed to create quiz: ' + (responseData.message || 'Unknown error'));
            }
    
            // If successful, update state and reset form fields
            setSuccess(true);
            setTitle('');
            setDomain('');
            setQuestions([]);
    
            // Debugging: Log success message
            console.log('Quiz created successfully!');
    
        } catch (error) {
            // Log the error message and update error state
            console.error('Caught error during submission:', error);
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
                    <Form.Label>Domain</Form.Label>
                    <Form.Control
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        required
                    />
                </Form.Group>

                <h3>Questions</h3>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-4">
                        <Form.Group>
                            <Form.Label>Question {qIndex + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                value={question.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                required
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
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Points"
                                        value={option.points}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'points', e.target.value)}
                                        required
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

                <Button variant="primary" onClick={addQuestion} className="mt-3">
                    Add Question
                </Button>

                <Button type="submit" className="mt-3" variant="success">
                    Create Quiz
                </Button>
            </Form>
        </div>
    );
};

export default QuizUpload;
