import React from "react";
import { Link } from "react-router-dom";
import './Home.css'; // Reuse same styles if needed

const AdminHome = () => {
  return (

    <div className="home-container">
      <section className="home">
        <h3 className="typing text">Admin Dashboard</h3>
        <p>Welcome, Admin! Manage the platform effectively from here.</p>

        <div className="button-container">
          <Link to="/manage-posts">
            <button className="custom-button admin-btn">Manage Posts</button>
          </Link>
          <Link to="/upload-quiz">
            <button className="custom-button admin-btn">Upload Quiz</button>
          </Link>
          <Link to="/manage-workshops">
            <button className="custom-button admin-btn">Manage Workshops</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;