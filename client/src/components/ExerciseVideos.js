import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './ExerciseVideos.css';
import crunches from '../Videos/crunches.mp4';
import LegLift from '../Videos/LegLift.mp4';
import Pushups from '../Videos/Pushups.mp4';
import sleep from '../Videos/sleep.mp4';
import Vups from '../Videos/Vups.mp4';

const ExerciseVideos = () => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videos = [
        crunches,  // Path to the videos
        LegLift,
        Pushups,
        sleep,
        Vups,
    ];

    const handleNextVideo = () => {
        if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        }
    };

    useEffect(() => {
        // Automatically skip to next video after 30 seconds
        if (currentVideoIndex < videos.length) {
            const timer = setTimeout(handleNextVideo, 30000); // 30 seconds for each video

            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [currentVideoIndex, videos.length]);

    return (
        <div className="exercise-video-container">
            <h2 className="exercise-video-title">Exercise Videos</h2>
            <div className="video-player-container">
                <video
                    width="100%"
                    height="auto"
                    controls
                    autoPlay
                    key={currentVideoIndex} // Changing the key forces the video to reload when switching
                >
                    <source src={videos[currentVideoIndex]} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="controls">
                <Button
                    variant="primary"
                    onClick={handleNextVideo}
                    className="next-video-button"
                >
                    Next Video
                </Button>
            </div>
        </div>
    );
};

export default ExerciseVideos;
