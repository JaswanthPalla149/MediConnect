import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Quiz from './Quiz';
import './QuizList.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [points, setPoints] = useState(0);
    const [visibleQuestions, setVisibleQuestions] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/quizzes');
            if (!response.ok) throw new Error('Failed to fetch quizzes');
            const data = await response.json();
            console.log('Fetched quizzes:', data);
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

    const handleOptionChange = (questionKey, option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [questionKey]: option,
        }));
    };

    const handleSubmit = () => {
        if (isSubmitted) return;

        let totalPoints = 0;

        quizzes.forEach((quiz) => {
            quiz.questions.forEach((question, questionIndex) => {
                const questionKey = `${quiz.quizId}-${questionIndex}`;
                const selectedOption = selectedOptions[questionKey];
                if (selectedOption) {
                    const optionDetails = question.options.find((opt) => opt.text === selectedOption);
                    if (optionDetails) {
                        totalPoints += optionDetails.points;
                    }
                }
            });
        });

        setPoints(totalPoints);
        setIsSubmitted(true);
    };

    const toggleQuestionVisibility = (questionKey) => {
        setVisibleQuestions((prev) => ({
            ...prev,
            [questionKey]: !prev[questionKey],
        }));
    };

    if (loading) return <p>Loading quizzes...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="quiz-list-container">
            <h1 className="quiz-list-title">Available Quizzes</h1>
            {quizzes.length === 0 ? (
                <p>No quizzes available at the moment.</p>
            ) : (
                quizzes.map((quiz) => (
                    <div key={quiz.quizId} className="quiz-card">
                        <Link to={`/quiz/${quiz.quizId}`} className="quiz-link">
                            <Quiz quiz={quiz} />
                        </Link>
                        <h4 className="quiz-title">{quiz.title}</h4>
                        <p className="quiz-description">{quiz.description}</p>
                        <h5 className="sample-questions-title">Sample Questions:</h5>

                        {quiz.questions.map((question, index) => {
                            const questionKey = `${quiz.quizId}-${index}`;
                            return (
                                <div key={questionKey} className="question-container">
                                    <button
                                        className="quiz-button"
                                        onClick={() => toggleQuestionVisibility(questionKey)}
                                    >
                                        Question {index + 1}
                                    </button>

                                    {visibleQuestions[questionKey] && (
                                        <div>
                                            <p className="question-text">{question.questionText}</p>
                                            <div>
                                                {question.options.map((option, oIndex) => (
                                                    <div key={oIndex} className="option-container">
                                                        <input
                                                            type="radio"
                                                            id={`${questionKey}-option${oIndex}`}
                                                            name={questionKey}
                                                            value={option.text}
                                                            onChange={() => handleOptionChange(questionKey, option.text)}
                                                        />
                                                        <label
                                                            className="option-label"
                                                            htmlFor={`${questionKey}-option${oIndex}`}
                                                        >
                                                            {option.text}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <button
                            className="quiz-button submit-button"
                            onClick={handleSubmit}
                            disabled={isSubmitted}
                        >
                            Submit
                        </button>
                        {points > 0 && <p className="points-display">Total Points Gained: {points}</p>}
                    </div>
                ))
            )}
        </div>
    );
};

export default QuizList;
