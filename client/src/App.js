import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import AdminHome from './components/AdminHome';
import Home from './components/Home';
import DomainSelection from './components/DomainSelection'; // Import DomainSelection

import PostList from './components/PostList'; // Import PostList
import QuizList from './components/QuizList';
import QuizUpload from './components/QuizUpload';
import Chatbot from './components/Chatbot';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

const DynamicNavbar = ({ role, username, resetAuth }) => {
  const renderAdminLinks = () => (
    <>
      <Nav.Link as={Link} to="/AdminHome">Home</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/create-post">Create Post</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/upload-quiz">Upload Quiz</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/manage-sections">Manage Sections</Nav.Link>
    </>
  );

  const renderUserLinks = () => (
    <>
      <Nav.Link as={Link} to="/Home">Home</Nav.Link>
      <Nav.Link as={Link} to="/Home/chatbot">Chatbot</Nav.Link>
      <Nav.Link as={Link} to="/Home/forum/select-domain">Community Forum</Nav.Link>
      <Nav.Link as={Link} to="/Home/quizzes">Quizzes</Nav.Link>
      <Nav.Link as={Link} to="/Home/sections">Explore Sections</Nav.Link>
    </>
  );

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={resetAuth} style={{ fontWeight: 'bold' }}>Platform</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {role === 'admin' ? renderAdminLinks() : renderUserLinks()}
          </Nav>
          <Nav className="ml-auto">
            {username && <Nav.Link disabled>Hello, {username}</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const App = () => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  const handleRoleSelection = (role) => {
    setRole(role);
  };

  const handleLogin = (username, id, role) => {
    setRole(role);
    setIsAuthenticated(true);
    setUsername(username);
    setId(id);
  };

  const resetAuth = () => {
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        {isAuthenticated && role && <DynamicNavbar role={role} username={username} resetAuth={resetAuth} />}

        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to={role === 'admin' ? '/AdminHome' : '/Home'} /> : <RoleSelection onSelectRole={handleRoleSelection} onLoginSuccess={handleLogin} />}

          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={role === 'admin' ? '/AdminHome' : '/Home'} /> : <LoginForm onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={role === 'admin' ? '/AdminHome' : '/Home'} /> : <RegistrationForm />}
          />
          
          {/* Authenticated Routes */}
          <Route path="/AdminHome" element={isAuthenticated && role === 'admin' ? <AdminHome username={username} id={id} /> : <Navigate to="/" />} />
          <Route path="/Home" element={isAuthenticated && role === 'user' ? <Home /> : <Navigate to="/" />} />
          <Route path="/Home/forum/select-domain" element={isAuthenticated ? <DomainSelection /> : <Navigate to="/" />} />

          <Route path="/Home/forum/:domain" element={isAuthenticated ? <PostList username={username} id={id} /> : <Navigate to="/" />} />

          <Route path="/Home/chatbot" element={isAuthenticated ? <Chatbot /> : <Navigate to="/" />} />
          <Route path="/Home/quizzes" element={isAuthenticated ? <QuizList /> : <Navigate to="/" />} />
          <Route path="/AdminHome/upload-quiz" element={isAuthenticated && role === 'admin' ? <QuizUpload /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
