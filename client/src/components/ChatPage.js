import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material'; // For Circular progress indicator
import './ChatPage.css';  // Custom CSS for styling

const ChatPage = ({ username, id }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // To control loading state

    // Function to handle sending messages
    const handleSendMessage = async () => {
        try {
            setIsLoading(true); // Start loading

            // 1. Perform sentiment analysis on the input text
            const sentimentResponse = await axios.post('http://localhost:5000/api/sentiment', {
                text: inputText
            });
            const sentimentScore = sentimentResponse.data.compound;

            // 2. Check the sentiment score threshold
            if (sentimentScore < -0.25) {
                setMessages([...messages, { text: 'We will contact you shortly. We’re here for you.', sender: 'System' }]);
                setInputText(''); // Clear input
                setIsLoading(false); // Stop loading
                return;
            }

            // 3. Send the message to the chatbot if sentiment is okay
            const chatResponse = await axios.post('http://localhost:5000/api/chat', {
                text: inputText
            });
            const botReply = chatResponse.data.response;  // Extract response from the `response` key

            // Update chat messages with user's message and bot's reply
            setMessages([...messages, { text: inputText, sender: username }, { text: botReply, sender: 'Bot' }]);
            setInputText(''); // Clear input

        } catch (err) {
            console.error(err);
            setError('Error communicating with the chatbot or sentiment analyzer.');
        } finally {
            setIsLoading(false); // Stop loading in any case
        }
    };

    return (
        <div className="chat-page-container">
            <h2>Chat with Support</h2>
            <div className="chat-box">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender === username ? 'user-message' : 'bot-message'}`}>
                        <div className="message-sender">
                            <strong>{message.sender}: </strong>
                        </div>
                        <p>{message.text}</p>
                    </div>
                ))}
                {isLoading && (
                    <div className="loading-indicator">
                        <CircularProgress />
                    </div>
                )}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading} // Disable input while loading
                />
                <button onClick={handleSendMessage} disabled={isLoading}>Send</button>
            </div>

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default ChatPage;