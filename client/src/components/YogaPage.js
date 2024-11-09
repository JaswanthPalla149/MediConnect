import React from 'react';
import Slider from 'react-slick'; // Import the Slick Slider
import YogaCard from './YogaCard';
import YogaData from './YogaData';
import './YogaPage.css'; // Ensure the correct CSS file is linked
import Wave from '../images/wave.png';
// React Slick settings for the slider
const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 cards at once
    slidesToScroll: 1, // Scroll 1 card at a time
    dots: true, // Enable pagination dots
    responsive: [
        {
            breakpoint: 1024, // For tablets
            settings: {
                slidesToShow: 3, // Show 3 cards on medium screens
            }
        },
        {
            breakpoint: 600, // For small screens
            settings: {
                slidesToShow: 1, // Show 1 card on small screens
            }
        }
    ]
};

const YogaPage = () => {
    const cardsArray = YogaData.map((card, index) => {
        return (
            <div key={index} className="yoga-card-container">
                <YogaCard
                    name={card.name}
                    description={card.description}
                    image={card.image}
                />
            </div>
        );
    });

    return (
        <div className="yoga-page-wrapper">

            <div className="yoga-page">
                <Slider {...settings}>
                    {cardsArray}
                </Slider>
            </div>
        </div>
    );
};

export default YogaPage;