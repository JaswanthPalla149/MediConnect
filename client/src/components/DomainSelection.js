import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Define the available domains
const domains = ['mindfullness', 'happiness', 'engagement'];  // domains should match what's used in the backend

const DomainSelection = () => {
    return (
        <Container className="my-4">
            <h2>Select a Domain</h2>
            <Row>
                {domains.map((domain, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{domain.charAt(0).toUpperCase() + domain.slice(1)}</Card.Title> {/* Capitalize first letter */}
                                <Card.Text>
                                    Explore posts related to {domain}.
                                </Card.Text>
                                <Link to={`/Home/forum/${domain.toLowerCase()}`}>
                                    <Button variant="primary">View Posts</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default DomainSelection;
