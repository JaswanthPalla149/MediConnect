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
            {quizzes.map((quiz) => (
                <Link to={`/quiz/${quiz.quizId}`} key={quiz.quizId}>
                    <Quiz quiz={quiz} />
                </Link>
            ))}
        </div>
    );
};

export default QuizList;