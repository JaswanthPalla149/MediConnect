import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap'; // Import Row and Col for layout

const Home = () => {
    return (
        <Container className="text-center mt-5">
            <h1>Welcome to Manaswini</h1>
            <p className="mt-3">Join our communities and explore various sections for mental well-being.</p>
            
            <Row className="mt-5">
                <Col md={4}>
                    <Link to="/forum">
                        <Button variant="primary" className="w-100 mb-3">Community Forum</Button>
                    </Link>
                </Col>
                <Col md={4}>
                    <Link to="/chatbot">
                        <Button variant="secondary" className="w-100 mb-3">Chatbot</Button>
                    </Link>
                </Col>
                <Col md={4}>
                    <Link to="/sections">
                        <Button variant="success" className="w-100">Explore Sections</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
