import React, { useState } from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const sectionsData = {
    ADHD: "ADHD (Attention Deficit Hyperactivity Disorder) is a mental health condition that affects focus and behavior control. Strategies include therapy, medication, and structured routines.",
    Meditation: "Meditation is a mental exercise that involves relaxation, focus, and awareness. It can reduce stress, improve concentration, and promote emotional health.",
    Anxiety: "Anxiety is a feeling of fear or worry that can be overwhelming. Techniques to manage anxiety include breathing exercises, therapy, and self-care practices.",
    Addiction: "Addiction is a psychological and physical dependence on substances or behaviors. Recovery involves support groups, therapy, and lifestyle changes."
};

const Sections = () => {
    const [selectedSection, setSelectedSection] = useState(null);

    return (
        <Container className="mt-5 text-center">
            <h1>Explore Sections</h1>
            <p>Select a section to learn more about it.</p>

            {/* Buttons for Sections */}
            <Row className="mt-4">
                {Object.keys(sectionsData).map((section) => (
                    <Col md={3} key={section} className="mb-3">
                        <Button 
                            variant="info" 
                            className="w-100" 
                            onClick={() => setSelectedSection(section)}
                        >
                            {section}
                        </Button>
                    </Col>
                ))}
            </Row>

            {/* Display Section Content */}
            {selectedSection && (
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>{selectedSection}</Card.Title>
                        <Card.Text>{sectionsData[selectedSection]}</Card.Text>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default Sections;
