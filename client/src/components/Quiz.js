import React from 'react';

const Quiz = ({ quiz }) => {
    return (
        <div className="quiz-card">
            <h2>{quiz.title}</h2>
            <p>Domain: {quiz.domain}</p>
            <p>Participants: {quiz.participantsCount}</p>
            <small>Created At: {new Date(quiz.createdAt).toLocaleString()}</small>
        </div>
    );
};

export default Quiz;