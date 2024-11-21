import axios from 'axios';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './QuizList.css';

const url = process.env.REACT_APP_BACKURL;

const QuizList = ({ username }) => {
    console.log('Props received in QuizList:', { username });

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({}); // Store selected answers for each question
    const [points, setPoints] = useState({}); // Track points separately for each quiz
    const [isSubmitted, setIsSubmitted] = useState({}); // Track submission status for each quiz
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState({}); // Track the current question index for each quiz
    const [quizSubmitted, setQuizSubmitted] = useState({}); // Track if a quiz has been submitted

    // Fetch quizzes from the API
    const fetchQuizzes = async () => {
        try {
            const response = await fetch(`${url}/api/quizzes`);
            if (!response.ok) throw new Error('Failed to fetch quizzes');
            const data = await response.json();
            // Print the domain of each quiz
            data.forEach((quiz) => {
                console.log(`Quiz ID: ${quiz._id}, Domain: ${quiz.domain}`);
            });
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
    const handleOptionChange = (quizId, questionIndex, option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [`${quizId}-${questionIndex}`]: option, // Store selected option for the question
        }));
    };

    // Handle form submission (calculate total points)
    const handleSubmit = async (quizId) => {
        if (isSubmitted[quizId]) return;

        let totalPoints = 0;

        // Find the quiz by quizId
        const quiz = quizzes.find((q) => q.quizId === quizId || q._id === quizId);
        const domain = quiz.domain;
        quiz.questions.forEach((question, questionIndex) => {
            const questionKey = `${quizId}-${questionIndex}`;
            const selectedOption = selectedOptions[questionKey];

            if (selectedOption) {
                const optionDetails = question.options.find((opt) => opt.text === selectedOption);
                if (optionDetails) {
                    totalPoints += optionDetails.points;
                }
            }
        });

        // Use _id for backend calls
        try {
            console.log('Submitting quiz!!');
            console.log(`quizId: ${quiz._id}`);
            if (username !== 'guest') {
                await axios.post(`${url}/api/users/${username}/quiz`, {
                    quizId: quiz._id, // Use the _id for backend calls
                    score: totalPoints,
                    domain,
                });
            }

            console.log('Quiz score submitted successfully');
        } catch (error) {
            console.error('Error submitting quiz score:', error);
        }

        setPoints((prev) => ({ ...prev, [quizId]: totalPoints })); // Set total points for the quiz
        setIsSubmitted((prev) => ({ ...prev, [quizId]: true })); // Mark the quiz as submitted
        setQuizSubmitted((prev) => ({ ...prev, [quizId]: true })); // Mark quiz as closed
    };

    // Function to move to the next question
    const nextQuestion = (quizId) => {
        setCurrentQuestionIndex((prev) => ({
            ...prev,
            [quizId]: (prev[quizId] || 0) + 1, // Increment the current question index for the quiz
        }));
    };

    // Check if all questions are answered for a given quiz
    const isQuizCompleted = (quizId) => {
        const quiz = quizzes.find((q) => q.quizId === quizId || q._id === quizId);
        return quiz.questions.every((question, index) => {
            const questionKey = `${quizId}-${index}`;
            return selectedOptions[questionKey] !== undefined;
        });
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
                        {/* Toggle visibility of quiz questions when clicked */}
                        <h4 className="quiz-title" onClick={() => setCurrentQuestionIndex((prev) => ({ ...prev, [quiz.quizId]: 0 }))}>
                            {quiz.title}
                        </h4>

                        <p className="quiz-description">{quiz.description}</p>

                        {/* Conditionally render questions if the quiz is visible */}
                        {currentQuestionIndex[quiz.quizId] !== undefined && quiz.questions.length > 0 && !quizSubmitted[quiz.quizId] && (
                            <div>
                                <h5 className="sample-questions-title">Sample Questions:</h5>

                                {/* Render only the current question */}
                                <div>
                                    {/* Make sure the current question exists */}
                                    {quiz.questions[currentQuestionIndex[quiz.quizId]] && (
                                        <div className="question-container">
                                            <p className="question-text">
                                                {quiz.questions[currentQuestionIndex[quiz.quizId]].questionText}
                                            </p>

                                            <div className="options-container">
                                                {/* Loop through the options for the question */}
                                                {quiz.questions[currentQuestionIndex[quiz.quizId]].options.map((option, oIndex) => (
                                                    <div key={oIndex} className="option-container">
                                                        <input
                                                            type="radio"
                                                            id={`${quiz.quizId}-${currentQuestionIndex[quiz.quizId]}-option${oIndex}`}
                                                            name={`${quiz.quizId}-${currentQuestionIndex[quiz.quizId]}`} // Group by question
                                                            value={option.text}
                                                            onChange={() => handleOptionChange(quiz.quizId, currentQuestionIndex[quiz.quizId], option.text)}
                                                            checked={selectedOptions[`${quiz.quizId}-${currentQuestionIndex[quiz.quizId]}`] === option.text}
                                                        />
                                                        <label
                                                            className="option-label"
                                                            htmlFor={`${quiz.quizId}-${currentQuestionIndex[quiz.quizId]}-option${oIndex}`}
                                                        >
                                                            {option.text}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Button to go to the next question */}
                                    {currentQuestionIndex[quiz.quizId] < quiz.questions.length - 1 && (
                                        <button
                                            className="quiz-button next-button"
                                            onClick={() => nextQuestion(quiz.quizId)}
                                        >
                                            Next Question
                                        </button>
                                    )}
                                </div>

                                {/* Submit button for the quiz (only show if quiz is completed) */}
                                {currentQuestionIndex[quiz.quizId] === quiz.questions.length - 1 && (
                                    <button
                                        className="quiz-button submit-button"
                                        onClick={() => handleSubmit(quiz.quizId)}
                                        disabled={!isQuizCompleted(quiz.quizId)}
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Display points after quiz submission */}
                        {quizSubmitted[quiz.quizId] && (
                            <p className="points-display">
                                Total Points Gained: {points[quiz.quizId]}
                            </p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default QuizList;
