import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './AuthContext';
import RoleSelection from './components/RoleSelection';
import AdminHome from './components/AdminHome';
import Home from './components/Home';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Sections from './components/Sections';
import QuizList from './components/QuizList';
import QuizUpload from './components/QuizUpload';
import QuizDetails from './components/QuizDetails';
import Chatbot from './components/Chatbot';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

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

const AppContent = () => {
    const { role, setRole } = useAuth(); // Access role from AuthContext
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks login status

    const handleLoginSuccess = (userRole) => {
        setRole(userRole);
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <Container>
                {/* Only show navbar if user is authenticated */}
                {isAuthenticated && <DynamicNavbar role={role} />}

                <Routes>
                    {/* Redirects based on authentication and role */}
                    <Route 
                        path="/" 
                        element={
                            isAuthenticated ? <Navigate to="/role-selection" /> : <Navigate to="/login" />
                        }
                    />
                    <Route 
                        path="/login" 
                        element={
                            isAuthenticated ? <Navigate to="/role-selection" /> : <LoginForm onLoginSuccess={handleLoginSuccess} />
                        } 
                    />
                    <Route 
                        path="/register" 
                        element={
                            isAuthenticated ? <Navigate to="/role-selection" /> : <RegistrationForm />
                        } 
                    />
                    <Route 
                        path="/role-selection" 
                        element={
                            isAuthenticated ? <RoleSelection onSelectRole={setRole} /> : <Navigate to="/login" />
                        }
                    />
                    <Route 
                        path="/AdminHome" 
                        element={
                            isAuthenticated && role === 'admin' ? <AdminHome /> : <Navigate to="/" />
                        } 
                    />
                    <Route 
                        path="/Home" 
                        element={
                            isAuthenticated && role === 'user' ? <Home /> : <Navigate to="/" />
                        } 
                    />
                    <Route path="/Home/sections" element={<Sections />} />
                    <Route path="/Home/quizzes" element={<QuizList />} />
                    <Route path="/AdminHome/upload-quiz" element={<QuizUpload />} />
                    <Route path="/AdminHome/quiz/:id" element={<QuizDetails />} />
                    <Route path="/Home/chatbot" element={<Chatbot />} />
                    <Route path="/Home/forum" element={<PostList />} />
                    <Route path="/AdminHome/create-post" element={<PostForm />} />
                    <Route path="/Home/create-post" element={<PostForm />} />
                </Routes>
            </Container>
        </Router>
    );
};

// Wrap AppContent in AuthProvider for context availability
const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
