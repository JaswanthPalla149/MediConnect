import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom'; 
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import Home from './components/Home';
import Chatbot from './components/Chatbot';
import Sections from './components/Sections'; 
import Login from './components/Login';
import QuizList from './components/QuizList';
import QuizUpload from './components/QuizUpload';
import QuizDetails from './components/QuizDetails';
import { Navbar, Nav, Container, Alert } from 'react-bootstrap';
import './App.css';

const App = () => {
    const [role, setRole] = useState(null);
    const [posts, setPosts] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
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

    const handleQuizCreated = (newQuiz) => {
        setQuizzes((prevQuizzes) => [...prevQuizzes, newQuiz]);
    };

    const fetchQuizzes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/quizzes'); 
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setQuizzes(data);
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false); 
        }
    };
    useEffect(() => {
        fetchPosts();
        fetchQuizzes();
    }, []);

    return (
        <Router>
            <Container>
                <DynamicNavbar /> {}
                {loading && <Alert variant="info">Loading posts...</Alert>} 
                {error && <Alert variant="danger">{error}</Alert>} 
                <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/forum" element={<PostList posts={posts} setPosts={setPosts} />} />
    <Route path="/create-post" element={<PostForm onPostCreated={handlePostCreated} />} />
    <Route path="/chatbot" element={<Chatbot />} />
    <Route path="/sections" element={<Sections />} /> 
    <Route path="/quizzes" element={<QuizList />} />
    <Route path="/upload-quiz" element={<QuizUpload />} />
    <Route path="/quiz/:id" element={<QuizDetails />} />
</Routes>
            </Container>
        </Router>
    );
};

const DynamicNavbar = () => {
    const location = useLocation(); 
    //const role = getUserRole();

    const renderLinks = () => {
        // if (role === 'admin') {
           return renderAdminLinks();
        // } else {
           //return renderUserLinks();
        //}
    };

    const renderAdminLinks = () => {
        if (location.pathname === '/') {
            return (
                <>
                   <Nav.Link as={Link} to="/">Home</Nav.Link>
      <Nav.Link as={Link} to="/forum">Community Forum</Nav.Link>
      <Nav.Link as={Link} to="/create-post">Create Post</Nav.Link>
      <Nav.Link as={Link} to="/sections">Manage Sections</Nav.Link>
      <Nav.Link as={Link} to="/upload-quiz">Upload Quiz</Nav.Link>  
                </>
            );
        } else if (location.pathname === '/forum') {
            return (
                <>
                    <Nav.Link as={Link} to="/create-post">Create Post</Nav.Link>
                    <Nav.Link as={Link} to="/">Back to Home</Nav.Link>
                </>
            );
        }
        return <Nav.Link as={Link} to="/">Back to Home</Nav.Link>;
    };
    const renderUserLinks = () => {
        if (location.pathname === '/') {
            return (
                <>
                    <Nav.Link as={Link} to="/forum">Community Forum</Nav.Link>
                    <Nav.Link as={Link} to="/chatbot">Chatbot</Nav.Link>
                    <Nav.Link as={Link} to="/sections">Explore Sections</Nav.Link>
                    <Nav.Link as={Link} to="/quizzes">View Quizzes</Nav.Link>
                </>
            );
        } else if (location.pathname === '/forum') {
            return <Nav.Link as={Link} to="/">Back to Home</Nav.Link>;
        }
        return <Nav.Link as={Link} to="/">Back to Home</Nav.Link>;
    };

    

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Manaswini</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">{renderLinks()}</Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default App;