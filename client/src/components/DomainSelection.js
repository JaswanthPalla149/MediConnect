import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './DomainSelection.css';

// Define the available domains
const domains = ['mindfullness', 'happiness', 'engagement'];

const DomainSelection = () => {
    return (
        <div  id = "cards-page" className="my-4">
            <h2  id = "cards-page-text"className="text-center mb-4">Select a Domain</h2>
            {/* Wrapper container for cards */}
            <div className="card-wrapper">
                <Row className="justify-content-center">
                    {domains.map((domain, index) => (
                        <Col key={index} md={4} className="mb-4 position-relative">
                            <Card className={`card card-${index}`} style={{ top: '3rem', height: '25rem', width: '25rem' }} >
                                <Card.Body>
                                    <Card.Title style = {{textAlign: 'center', fontWeight: 'bold'}}>{domain.charAt(0).toUpperCase() + domain.slice(1)}</Card.Title> {/* Capitalize first letter */}
                                    <Card.Text style = {{textAlign:'center', fontWeight: '500'}}>
                                        Exploring  posts related to {domain}.
                                    </Card.Text>
                                    <div className = "center-button">
                                    <Link to={`/Home/forum/${domain.toLowerCase()}`}>
                                        <Button variant="primary">View Posts</Button>
                                    </Link>
                                    </div>

                                    <div className="card-footer">
                                        {/* Optionally add more content in footer */}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default DomainSelection;