import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./DynamicNavbar.css"; // Import the CSS file for styling

const DynamicNavbar = ({ role, username, resetAuth }) => {
  const renderAdminLinks = () => (
    <>
      <Nav.Link as={Link} to="/AdminHome">Home</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/create-post">Create Post</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/manage-posts">Manage Posts</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/sections">Manage Sections</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/upload-quiz">Upload Quiz</Nav.Link>
      <Nav.Link as={Link} to="AdminHome/view-users">Manage Users</Nav.Link>
    </>
  );

  const renderUserLinks = () => (
    <>
      <Nav.Link as={Link} to="/Home">Home</Nav.Link>
      <Nav.Link as={Link} to="/Home/forum/select-domain">Community Forum</Nav.Link>
      <Nav.Link as={Link} to="/Home/quizzes">Quizzes</Nav.Link>
      <Nav.Link as={Link} to="/Home/sections">Explore Sections</Nav.Link>
      <Nav.Link as={Link} to="/Home/YogaPage">Yoga</Nav.Link>
      <Nav.Link as={Link} to="/Home/create-post">Create Post</Nav.Link>
      <Nav.Link as={Link} to="/Home/ChatPage">ChatUs</Nav.Link>
      <Nav.Link as={Link} to="/Home/Dboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/Home/exercise-videos">Exercise Videos</Nav.Link>
    </>
  );

  const handleLogout = () => {
    resetAuth();
    console.log("Logout button clicked, resetAuth called");
  };

  return (
    <Navbar bg="dark" expand="lg" className="dynamic-navbar">
      <div className="navbar-inner">
        <Navbar.Brand
          as={Link}
          style={{
            fontFamily: 'Roboto'
          }}
          to="/"
          onClick={() => {
            resetAuth();
            console.log("Manaswini clicked, resetAuth called");
          }}
          className="navbar-brand"
        >
          Manaswini
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {role === "admin" ? renderAdminLinks() : renderUserLinks()}
          </Nav>
          <Nav className="ml-auto">
            {username && (
              <Nav.Link as={Link} to="#" onClick={handleLogout} className="logout-link">
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default DynamicNavbar;
