import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './QuizList.css';
const url = process.env.REACT_APP_BACKURL;
const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({}); // Store selected answers for each question
    const [points, setPoints] = useState(0); // Total points earned
    const [visibleQuestions, setVisibleQuestions] = useState({}); // Track visible questions
    const [isSubmitted, setIsSubmitted] = useState(false); // To track if the quiz has been submitted

    // Fetch quizzes from the API
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

    // Fetch quizzes when component mounts
    useEffect(() => {
        fetchQuizzes();
    }, []);

    // Handle change in selected options for each question
    const handleOptionChange = (questionKey, option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [questionKey]: option, // Store selected option for the question
        }));
    };

    // Handle form submission (calculate total points)
    const handleSubmit = () => {
        if (isSubmitted) return;

        let totalPoints = 0;

        quizzes.forEach((quiz) => {
            quiz.questions.forEach((question, questionIndex) => {
                const questionKey = `${quiz.quizId}-${questionIndex}`;
                const selectedOption = selectedOptions[questionKey]; // Get the selected option for the question

                if (selectedOption) {
                    const optionDetails = question.options.find((opt) => opt.text === selectedOption);
                    if (optionDetails) {
                        totalPoints += optionDetails.points;
                    }
                }
            });
        });

        setPoints(totalPoints); // Set total points earned
        setIsSubmitted(true); // Mark the quiz as submitted
    };

    // Toggle visibility of questions
    const toggleQuestionVisibility = (questionKey) => {
        setVisibleQuestions((prev) => ({
            ...prev,
            [questionKey]: !prev[questionKey], // Toggle the visibility
        }));
    };

    // If data is loading, show loading message
    if (loading) return <p>Loading quizzes...</p>;

    // If there's an error fetching data, show error message
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="quiz-list-container">
            <h1 className="quiz-list-title">Available Quizzes</h1>

            {/* If no quizzes are available, display a message */}
            {quizzes.length === 0 ? (
                <p>No quizzes available at the moment.</p>
            ) : (
                quizzes.map((quiz) => (
                    <div key={quiz.quizId} className="quiz-card">
                        <Link to={`/quiz/${quiz.quizId}`} className="quiz-link">
                            <h4 className="quiz-title">{quiz.title}</h4>
                        </Link>
                        <p className="quiz-description">{quiz.description}</p>
                        <h5 className="sample-questions-title">Sample Questions:</h5>

                        {/* Loop through questions of each quiz */}
                        {quiz.questions.map((question, index) => {
                            const questionKey = `${quiz.quizId}-${index}`;
                            return (
                                <div key={questionKey} className="question-container">
                                    {/* Button to toggle visibility of question and options */}
                                    <button
                                        className="quiz-button"
                                        onClick={() => toggleQuestionVisibility(questionKey)}
                                    >
                                        Question {index + 1}
                                    </button>

                                    {/* Conditionally render question and options */}
                                    {visibleQuestions[questionKey] && (
                                        <div className="question-details">
                                            <p className="question-text">{question.questionText}</p>
                                            <div className="options-container">
                                                {/* Loop through the options for the question */}
                                                {question.options.map((option, oIndex) => (
                                                    <div key={oIndex} className="option-container">
                                                        <input
                                                            type="radio"
                                                            id={`${questionKey}-option${oIndex}`}
                                                            name={questionKey} // Group by question
                                                            value={option.text}
                                                            onChange={() => handleOptionChange(questionKey, option.text)}
                                                            checked={selectedOptions[questionKey] === option.text}
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
                        {/* Submit button for the quiz */}
                        <button
                            className="quiz-button submit-button"
                            onClick={handleSubmit}
                            disabled={isSubmitted}
                        >
                            Submit
                        </button>

                        {/* Display points if the quiz is submitted */}
                        {points > 0 && <p className="points-display">Total Points Gained: {points}</p>}
                    </div>
                ))
            )}
        </div>
    );
};

export default QuizList;
