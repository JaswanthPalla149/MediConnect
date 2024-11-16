// src/components/QuizDelete.js
import React from 'react';
import { Button } from 'react-bootstrap';
const url = process.env.REACT_APP_BACKURL;
const QuizDelete = ({ quizId, onDelete }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`${url}/api/quizzes/${quizId}`, {
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