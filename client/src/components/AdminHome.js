import React from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';
import { motion } from 'framer-motion';
import Wave from '../images/wave.png';

const AdminHome = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <motion.div className="adminHome home-container" style={{ height: '140vh', width: '100%', background: 'rgba(155, 104, 250, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '25px', marginTop: '2rem' }}>
            {/* Laptop Wrapper */}
            <motion.div className="laptop-wrapper">
                {/* Laptop Screen (Blue) */}
                <motion.div className="laptop-screen">
                    <section id="home-admin" className="adminHome home">
                        <div className="adminHome admin-image-container">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg"
                                alt="Admin Icon"
                                className="adminHome admin-image"
                            />
                        </div>
                        <div className="adminHome admin-content">
                            <h3 className="adminHome typing-text">Admin Dashboard</h3>
                            <p className="adminHome admin-welcome-text" style={{ color: 'white' }}>
                                Welcome, Admin! Manage the platform effectively from here.
                            </p>
                            <div className="adminHome button-container">
                                <input
                                    type="radio"
                                    name="adminOption"
                                    id="createPost"
                                    className="adminHome admin-radio"
                                    onChange={() => handleNavigation("/AdminHome/create-post")}
                                />
                                <label htmlFor="createPost" className="adminHome admin-label">Create Post</label>

                                <input
                                    type="radio"
                                    name="adminOption"
                                    id="managePosts"
                                    className="adminHome admin-radio"
                                    onChange={() => handleNavigation("/AdminHome/manage-posts")}
                                />
                                <label htmlFor="managePosts" className="adminHome admin-label">Manage Posts</label>

                                <input
                                    type="radio"
                                    name="adminOption"
                                    id="uploadQuiz"
                                    className="adminHome admin-radio"
                                    onChange={() => handleNavigation("/AdminHome/upload-quiz")}
                                />
                                <label htmlFor="uploadQuiz" className="adminHome admin-label">Upload Quiz</label>
                                <input
                                    type="radio"
                                    name="adminOption"
                                    id="viewUsers"
                                    className="adminHome admin-radio"
                                    onChange={() => handleNavigation("/AdminHome/view-users")}
                                />
                                <label htmlFor="viewUsers" className="adminHome admin-label">Manage Users</label>  {/* Correct htmlFor to match the input id */}
                            </div>
                        </div>
                    </section>
                </motion.div>

                {/* Laptop Base (Yellow) */}
                <div className="laptop-base"></div>

                {/* Laptop Stand (Black) */}

            </motion.div>
            <div className="laptop-stand"></div>
        </motion.div>
    );
};

export default AdminHome;
