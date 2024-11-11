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

    const fetchQuizzes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/quizzes');
            if (!response.ok) throw new Error('Failed to fetch quizzes');
            const data = await response.json();
            console.log('Fetched quizzes:', data); // Log to confirm the quiz data structure
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

    const handleOptionChange = (questionIndex, option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [questionIndex]: option,
        }));
    };

    const handleSubmit = () => {
        let totalPoints = 0;

        for (const questionIndex in selectedOptions) {
            const selectedOption = selectedOptions[questionIndex];
            const question = quizzes[0].questions[questionIndex];
            const optionDetails = question.options.find(opt => opt.text === selectedOption);
            if (optionDetails) {
                totalPoints += optionDetails.points;
            }
        }

        setPoints(totalPoints);
    };

    const toggleQuestionVisibility = (questionIndex) => {
        setVisibleQuestions((prev) => ({
            ...prev,
            [questionIndex]: !prev[questionIndex],
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

                        {quiz.questions.map((question, index) => (
                            <div key={index} className="question-container">
                                <button className="quiz-button" onClick={() => toggleQuestionVisibility(index)}>
                                    Question {index + 1}
                                </button>

                                {visibleQuestions[index] && (
                                    <div>
                                        <p className="question-text">{question.questionText}</p>
                                        <div>
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="option-container">
                                                    <input 
                                                        type="radio" 
                                                        id={`question${index}-option${oIndex}`} 
                                                        name={`question${index}`} 
                                                        value={option.text} 
                                                        onChange={() => handleOptionChange(index, option.text)}
                                                    />
                                                    <label className="option-label" htmlFor={`question${index}-option${oIndex}`}>
                                                        {option.text}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button className="quiz-button submit-button" onClick={handleSubmit}>Submit</button>
                        {points > 0 && <p className="points-display">Total Points Gained: {points}</p>}
                    </div>
                ))
            )}
        </div>
    );
};

export default QuizList;
