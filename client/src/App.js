import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom'; 
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import Home from './components/Home';
import Chatbot from './components/Chatbot';
import Sections from './components/Sections'; 
import { Navbar, Nav, Container, Alert } from 'react-bootstrap';
import './App.css';

const App = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    
    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/posts');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false); 
        }
    };

    
    const handlePostCreated = (newPost) => {
        setPosts((prevPosts) => [...prevPosts, newPost]);
    };

    
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Router>
            <Container>
                <DynamicNavbar /> {/* Navbar changes  accoringly and dynamically based on the route */}
                {loading && <Alert variant="info">Loading posts...</Alert>} 
                {error && <Alert variant="danger">{error}</Alert>} 
                <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/forum" element={<PostList posts={posts} setPosts={setPosts} />} />
    <Route path="/create-post" element={<PostForm onPostCreated={handlePostCreated} />} />
    <Route path="/chatbot" element={<Chatbot />} />
    <Route path="/sections" element={<Sections />} /> 
</Routes>
            </Container>
        </Router>
    );
};

const DynamicNavbar = () => {
    const location = useLocation(); 

    
    const renderLinks = () => {
        if (location.pathname === "/") {
            return (
                <>
                    <Nav.Link as={Link} to="/forum">Community Forum</Nav.Link>
                    <Nav.Link as={Link} to="/chatbot">Chatbot</Nav.Link>
                    <Nav.Link as={Link} to="/sections">Explore Sections</Nav.Link>  
                </>
            );
        } else if (location.pathname === "/forum") {
            return (
                <>
                    <Nav.Link as={Link} to="/create-post">Create Post</Nav.Link>
                    <Nav.Link as={Link} to="/">Back to Home</Nav.Link> 
                </>
            );
        } else if (location.pathname === "/sections") {
            return (
                <>
                    <Nav.Link as={Link} to="/">Back to Home</Nav.Link> 
                </>
            );
        } else if (location.pathname === "/chatbot") {
            return (
                <>
                    <Nav.Link as={Link} to="/">Back to Home</Nav.Link> 
                </>
            );
        }
        return null; 
    };
    

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">Manaswini</Navbar.Brand>
            <Nav className="ml-auto">
                {renderLinks()} {/* Dynamically render navigation links */}
            </Nav>
        </Navbar>
    );
};

export default App;
