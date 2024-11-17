import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ExerciseVideos.css';
import crunches from '../Videos/crunches.mp4';
import LegLift from '../Videos/LegLift.mp4';
import Pushups from '../Videos/Pushups.mp4';
import sleep from '../Videos/sleep.mp4';
import Vups from '../Videos/Vups.mp4';

const ExerciseVideos = () => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [skippedCount, setSkippedCount] = useState(0);
    const [isVideoChanging, setIsVideoChanging] = useState(false); // State to track video change animation
    const videoRef = useRef(null);
    const navigate = useNavigate(); // Initialize the navigate hook

    const videos = [crunches, LegLift, Pushups, sleep, Vups];

    const handleNextVideo = () => {
        if (currentVideoIndex < videos.length - 1) {
            setSkippedCount(skippedCount + 1); // Increment skipped count when the "Next" button is clicked
            setIsVideoChanging(true);
            setCurrentVideoIndex(currentVideoIndex + 1);
        } else if (currentVideoIndex === videos.length - 1) {
            setSkippedCount(skippedCount + 1);
            setIsVideoChanging(true); // Set animation flag for last video change
            setShowPopup(true); // Show popup since it's the last video
        }
    };

    useEffect(() => {
        if (currentVideoIndex < videos.length) {
            const timer = setTimeout(handleNextVideo, 30000); // Automatically skip after 30 seconds
            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [currentVideoIndex, videos.length]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            const preventSeek = () => {
                if (videoElement.currentTime > 0 && !videoElement.paused) {
                    videoElement.currentTime = 0;
                }
            };

            const handleVideoEnd = () => {
                if (currentVideoIndex < videos.length - 1) {
                    setIsVideoChanging(true);
                    setCurrentVideoIndex(currentVideoIndex + 1);
                } else {
                    setShowPopup(true);
                }
            };

            videoElement.addEventListener('seeking', preventSeek);
            videoElement.addEventListener('ended', handleVideoEnd);

            return () => {
                videoElement.removeEventListener('seeking', preventSeek);
                videoElement.removeEventListener('ended', handleVideoEnd);
            };
        }
    }, [currentVideoIndex]);

    // Reset animation class after video has changed
    useEffect(() => {
        if (!isVideoChanging) return;

        const timer = setTimeout(() => {
            setIsVideoChanging(false); // Reset the animation flag
        }, 500); // 500ms to match the animation duration

        return () => clearTimeout(timer);
    }, [isVideoChanging]);

    const handleClosePopup = () => {
        setShowPopup(false); // Close the popup
        navigate('/yoga'); // Navigate back to YogaPage (replace '/yoga' with your actual route)
    };

    return (
        <div className="exercise-video-container">
            <h2 className="exercise-video-title" style = {{color:'#00ff00',fontSize:'3rem',textAlign:'center',fontFamily:'Merriweather'}}>Exercise Videos</h2>
            <div className={`video-player-container ${isVideoChanging ? 'changing' : ''}`}>
                <video
                    ref={videoRef}
                    width="100%"
                    height="auto"
                    autoPlay
                    key={currentVideoIndex} // Changing the key forces the video to reload when switching
                >
                    <source src={videos[currentVideoIndex]} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="controls">
                <button
                    onClick={handleNextVideo}
                    className="next-video-button"
                >
                    Next Video
                </button>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-message">
                        <h3>Well Done!</h3>
                        <p>You have completed all the exercise videos.</p>
                        <p>You skipped {skippedCount} video(s).</p>
                        <button
                            className="close-popup-btn"
                            onClick={handleClosePopup} // Close popup and navigate back to YogaPage
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseVideos;
