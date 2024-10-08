import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const Home = () => {
    return (
        <Container className="text-center mt-5">
            <h1>Welcome to the Manaswini</h1>
            <div className="mt-4">
                <Link to="/forum">
                    <Button variant="primary" className="mr-3">Community Forum</Button>
                </Link>
                <Link to="/chatbot">
                    <Button variant="secondary">Chatbot</Button>
                </Link>
            </div>
        </Container>
    );
};

export default Home;
