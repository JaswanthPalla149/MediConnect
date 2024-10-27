import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Quiz from './Quiz';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/quizzes');
            if (!response.ok) throw new Error('Failed to fetch quizzes');
            const data = await response.json();
            setQuizzes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    if (loading) return <p>Loading quizzes...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Available Quizzes</h1>
            {quizzes.length === 0 ? (
                <p>No quizzes available at the moment.</p>
            ) : (
                quizzes.map((quiz) => (
                    <div key={quiz.quizId || quiz.id} style={{ marginBottom: '20px' }}>
                        <Link to={`/quiz/${quiz.quizId}`}>
                            <Quiz quiz={quiz} />
                        </Link>
                        <h4>{quiz.title}</h4>
                        <p>{quiz.description}</p>
                        <h5>Sample Questions:</h5>
                        <ul>
                            {quiz.questions && quiz.questions.slice(0, 2).map((question, index) => (
                                <li key={index}>
                                    {question.questionText}
                                    <ul>
                                        {question.options && question.options.map((option, oIndex) => (
                                            <li key={oIndex}>
                                                {option.text} (Points: {option.points || 0})
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default QuizList;
