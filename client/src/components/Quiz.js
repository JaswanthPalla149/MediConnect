import React from 'react';

const Quiz = ({ quiz }) => {
    return (
        <div className="quiz-card">
            <h2>{quiz.title}</h2>
            <p>Domain: {quiz.domain}</p>
            <p>Questions: {quiz.questions ? quiz.questions.length : 0}</p>
            <small>Created At: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleString() : 'N/A'}</small>
        </div>
    );
};

export default Quiz;
