import React, { useState } from 'react';
import Slider from 'react-slick';
import YogaCard from './YogaCard';
import YogaData from './YogaData';
import './YogaPage.css';
import { useNavigate } from 'react-router-dom';
import {motion} from "framer-motion";

const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
};

const YogaPage = () => {
    const [isPanelVisible, setPanelVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();  // Use react-router's useNavigate for navigation

    // Click handler for the image
    const handleImageClick = (card) => {
        console.log("Image clicked:", card);
        setSelectedCard(card);
        setPanelVisible(true);
    };

    // Handler for the back button
    const handleBackClick = () => {
        console.log("Back button clicked");
        setPanelVisible(false);
        setSelectedCard(null);
    };

    // Navigate to the exercise page
    const handleDoExercisesClick = () => {
        // Hide any open panel before navigating
        setPanelVisible(false);
        setSelectedCard(null);
        navigate('/Home/exercise-videos'); // Redirect to ExerciseVideos page
    };

    // Render the cards
    const cardsArray = YogaData.map((card, index) => (
        <div key={index} className="yoga-card-container">
            <YogaCard
                name={card.name}
                description={card.description}
                image={card.image}
                onClick={() => handleImageClick(card)}
            />
        </div>
    ));

    return (
        <motion.div className="yoga-page-wrapper">
            <h2 style={{ color: '#ffffff',fontSize:'60px',fontWeight:'700',fontFamily:'Playfair Display'}}>The Indian Yoga</h2>
            <button className="exercise-btn" onClick={handleDoExercisesClick}>
                Do exercises
            </button>

            {/* Overlay Panel */}
            {isPanelVisible && selectedCard && (
                <div className="overlay">
                    <div className="panel">
                        <h2 className="panel-title">{selectedCard.name}</h2>
                        <img
                            src={selectedCard.image}
                            alt={selectedCard.name}
                            className="panel-image"
                        />
                        <p className="panel-description">{selectedCard.description}</p>
                        <button onClick={handleBackClick} className="back-btn">
                            Back
                        </button>
                    </div>
                </div>
            )}

            {/* Slider Section */}
            {!isPanelVisible && (
                <div className="yoga-page">
                    <Slider {...settings}>
                        {cardsArray}
                    </Slider>
                </div>
            )}
        </motion.div>
    );
};

export default YogaPage;
