import React, { useState, useEffect } from 'react';
import { Alert, Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // For v6
import RoleSelection from './components/RoleSelection';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import AdminHome from './components/AdminHome';
import Home from './components/Home';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Sections from './components/Sections';
import QuizList from './components/QuizList';
import QuizUpload from './components/QuizUpload';
import QuizDetails from './components/QuizDetails';
import Chatbot from './components/Chatbot';

const DynamicNavbar = ({ role }) => {
    const renderAdminLinks = () => (
        <>
            <Nav.Link as={Link} to="/AdminHome">Home</Nav.Link>
            <Nav.Link as={Link} to="/AdminHome/create-post">Create Post</Nav.Link>
            <Nav.Link as={Link} to="/AdminHome/sections">Manage Sections</Nav.Link>
            <Nav.Link as={Link} to="/AdminHome/upload-quiz">Upload Quiz</Nav.Link>
            <Nav.Link as={Link} to="/Home/forum">Community Forum</Nav.Link>
        </>
    );

    const renderUserLinks = () => (
        <>
            <Nav.Link as={Link} to="/Home">Home</Nav.Link>
            <Nav.Link as={Link} to="/Home/forum">Community Forum</Nav.Link>
            <Nav.Link as={Link} to="/Home/chatbot">Chatbot</Nav.Link>
            <Nav.Link as={Link} to="/Home/sections">Explore Sections</Nav.Link>
            <Nav.Link as={Link} to="/Home/quizzes">View Quizzes</Nav.Link>
        </>
    );

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold' }}>Manaswini</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {role === 'admin' ? renderAdminLinks() : renderUserLinks()}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

const App = () => {
    const [role, setRole] = useState(null); // Tracks role ('admin' or 'user')

    const handleRoleSelection = (role) => {
        setRole(role);
    };

    const handleLogin = (role) => {
        setRole(role); // Set the role upon successful login
        setIsAuthenticated(true); // Marks the user as logged in
    };

    return (
        <Router>
            <Container>
                {/* Show navbar if a role is selected */}
                {role && <DynamicNavbar role={role} />}

                <Routes>
                    <Route path="/" element={<RoleSelection onSelectRole={handleRoleSelection} />} />
                    <Route path="/AdminHome" element={<AdminHome />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Home/sections" element={<Sections />} />
                    <Route path="/Home/quizzes" element={<QuizList />} />
                    <Route path="/AdminHome/upload-quiz" element={<QuizUpload />} />
                    <Route path="/AdminHome/quiz/:id" element={<QuizDetails />} />
                    <Route path="/Home/chatbot" element={<Chatbot />} />
                    <Route path="/AdminHome/sections" element={<Sections />} />
                    <Route path="/Home/forum" element={<PostList />} />
                    <Route path="/AdminHome/create-post" element={<PostForm />} />
                    <Route path="/Home/create-post" element={<PostForm />} />
                    
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
