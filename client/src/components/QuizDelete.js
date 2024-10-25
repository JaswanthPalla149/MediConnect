// src/components/QuizDelete.js
import React from 'react';
import { Button } from 'react-bootstrap';

const QuizDelete = ({ quizId, onDelete }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete quiz');
            onDelete(quizId);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button variant="danger" onClick={handleDelete}>
            Delete Quiz
        </Button>
    );
};

export default QuizDelete;