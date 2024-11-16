import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const url = process.env.REACT_APP_BACKURL;
const QuizDetails = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuiz = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/quizzes/${id}`);
            if (!response.ok) throw new Error('Failed to fetch quiz');
            const data = await response.json();
            setQuiz(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [id]);

    if (loading) return <p>Loading quiz...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            <p>Domain: {quiz.domain}</p>
            <h3>Questions</h3>
            <ul>
                {quiz.questions.map((q, index) => (
                    <li key={index}>
                        <strong>{q.questionText}</strong>
                        <ul>
                            {q.options.map((option, i) => (
                                <li key={i}>
                                    {option.text} (Points: {option.points})
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizDetails;
