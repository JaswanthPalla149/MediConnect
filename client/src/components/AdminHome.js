import React from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <section className="home">
        <div className="admin-image-container">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg" 
            alt="Admin Icon" 
            className="admin-image" 
          />
        </div>
        <div className="admin-content">
          <h3 className="typing-text">Admin Dashboard</h3>
          <p className="admin-welcome-text">Welcome, Admin! Manage the platform effectively from here.</p>
          <div className="button-container">
            <input 
              type="radio" 
              name="adminOption" 
              id="managePosts" 
              className="admin-radio" 
              onChange={() => handleNavigation("/AdminHome/manage-posts")}
            />
            <label htmlFor="managePosts" className="admin-label">Manage Posts</label>
            
            <input 
              type="radio" 
              name="adminOption" 
              id="uploadQuiz" 
              className="admin-radio" 
              onChange={() => handleNavigation("/AdminHome/upload-quiz")}
            />
            <label htmlFor="uploadQuiz" className="admin-label">Upload Quiz</label>
            
            <input 
              type="radio" 
              name="adminOption" 
              id="manageWorkshops" 
              className="admin-radio" 
              onChange={() => handleNavigation("/AdminHome/manage-workshops")}
            />
            <label htmlFor="manageWorkshops" className="admin-label">Manage Workshops</label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
