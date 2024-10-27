// src/components/SectionCard.js

import React from 'react';
import { Col } from 'react-bootstrap';

const SectionCard = ({ section, data, onClick }) => (
    <Col md={3} className="mb-3">
        <div 
            className="card"
            onClick={() => onClick(section)} 
            style={{ cursor: 'pointer', border: 'none' }}
        >
            <img 
                src={data.giphy} 
                alt={section} 
                style={{ width: '100%', borderRadius: '10px' }} 
            />
            <p>{data.title}</p>
        </div>
    </Col>
);

export default SectionCard;