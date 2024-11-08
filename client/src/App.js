import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleRoleSelection = (role) => {
        setRole(role);
    };

    const handleLogin = (role) => {
        setRole(role); // Set the role upon successful login
        setIsAuthenticated(true); // Marks the user as logged in
    };

    return (
        <Router>
            <div>
                {isAuthenticated && role && <DynamicNavbar role={role} />}

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
                    <Route path="/AdminHome" element={isAuthenticated && role === 'admin' ? <AdminHome /> : <Navigate to="/" />} />
                    <Route path="/Home" element={isAuthenticated && role === 'user' ? <Home /> : <Navigate to="/" />} />
                    <Route path="/Home/sections" element={isAuthenticated ? <Sections /> : <Navigate to="/" />} />
                    <Route path="/Home/quizzes" element={isAuthenticated ? <QuizList /> : <Navigate to="/" />} />
                    <Route path="/AdminHome/upload-quiz" element={isAuthenticated && role === 'admin' ? <QuizUpload /> : <Navigate to="/" />} />
                    <Route path="/AdminHome/quiz/:id" element={isAuthenticated && role === 'admin' ? <QuizDetails /> : <Navigate to="/" />} />
                    <Route path="/Home/chatbot" element={isAuthenticated ? <Chatbot /> : <Navigate to="/" />} />
                    <Route path="/Home/forum" element={isAuthenticated ? <PostList /> : <Navigate to="/" />} />
                    <Route path="/AdminHome/create-post" element={isAuthenticated && role === 'admin' ? <PostForm /> : <Navigate to="/" />} />
                    <Route path="/Home/create-post" element={isAuthenticated ? <PostForm /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
