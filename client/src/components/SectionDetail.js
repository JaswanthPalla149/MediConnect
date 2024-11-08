// src/components/SectionDetail.js

import React from 'react';
import { Card } from 'react-bootstrap';


const SectionDetail = ({ data, onBack }) => (
    <Card className="mt-5 section-detail"
        style = {{
            border: ' 6px solid #708090',
            borderRadius: '20px',

        }}
    >
        <Card.Body>
            <Card.Title>{data.title}</Card.Title>
            <img 
                src={data.image} 
                alt={data.title} 
                style={{ 
                    width: '100%', borderRadius: '10px', marginBottom: '20px',
                }} 
            />
            <div className='blur'></div>
            {data.content}
            <button className="back-button" onClick={onBack}>
                Back
            </button>
        </Card.Body>
    </Card>
);

export default SectionDetail;
