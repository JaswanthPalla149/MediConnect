import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SectionCard.css';

const SectionCard = ({ section, data, onClick }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const navigate = useNavigate();

    const handleCardClick = () => {
        // Trigger the animation
        setIsAnimating(true);
        setIsOverlayVisible(true);

        // After animation finishes, navigate to the detail page
        setTimeout(() => {
            onClick(section);  // This will navigate to the section detail page
            setIsOverlayVisible(false);  // Hide the overlay after animation
        }, 1800);  // Duration should match the total duration of the animation
    };

    return (
        <>
            {/* Overlay - Covers entire page during animation */}
            {isOverlayVisible && <div className="overlay" />}

            <Col md={3} className="mb-4">
                <div 
                    className={`card-container ${isAnimating ? 'animate-card' : ''}`}
                    onClick={handleCardClick}
                >
                    <div className="card">
                        <img 
                            src={data.giphy} 
                            alt={section} 
                            className="card-img"
                        />
                        <div className="card-body">
                            <p className="card-title">{data.title}</p>
                        </div>
                    </div>
                </div>
            </Col>
        </>
    );
};

export default SectionCard;
