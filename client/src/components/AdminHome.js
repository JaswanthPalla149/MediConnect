import React from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';

const AdminHome = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="adminHome home-container">
            <section className="adminHome home">
                <div className="adminHome admin-image-container">
                    <img 
                        src="https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg" 
                        alt="Admin Icon" 
                        className="adminHome admin-image" 
                    />
                </div>
                <div className="adminHome admin-content">
                    <h3 className="adminHome typing-text">Admin Dashboard</h3>
                    <p className="adminHome admin-welcome-text">
                        Welcome, Admin! Manage the platform effectively from here.
                    </p>
                    <div className="adminHome button-container">
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
                            id="manageWorkshops" 
                            className="adminHome admin-radio" 
                            onChange={() => handleNavigation("/AdminHome/manage-workshops")}
                        />
                        <label htmlFor="manageWorkshops" className="adminHome admin-label">Manage Workshops</label>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminHome;
