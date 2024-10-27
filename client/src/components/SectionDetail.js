// src/components/SectionDetail.js

import React from 'react';
import { Card } from 'react-bootstrap';

const SectionDetail = ({ data, onBack }) => (
    <Card className="mt-5">
        <Card.Body>
            <Card.Title>{data.title}</Card.Title>
            <img 
                src={data.image} 
                alt={data.title} 
                style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }} 
            />
            {data.content}
            <button className="back-button" onClick={onBack}>
                Back
            </button>
        </Card.Body>
    </Card>
);

export default SectionDetail;
