import React, { useState } from 'react';
import Slider from 'react-slick';
import YogaCard from './YogaCard';
import YogaData from './YogaData';
import './YogaPage.css';

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
        <div className="yoga-page-wrapper">
            <h1 style = {{color:'white'}}>The Indian Yoga</h1>
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
        </div>
    );
};

export default YogaPage;
