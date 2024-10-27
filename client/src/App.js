import React, { useEffect, useState } from 'react';
import { Alert, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import AdminHome from './components/AdminHome';
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import QuizDetails from './components/QuizDetails';
import QuizList from './components/QuizList';
import QuizUpload from './components/QuizUpload';
import RoleSelection from './components/RoleSelection';
import Sections from './components/Sections';



const DynamicNavbar = ({ role }) => {
    const location = useLocation(); 
   //const role = getRole();
   

    const renderLinks = () => {
         if (role === 'admin') {
           return renderAdminLinks();
        } else {
           return renderUserLinks();
        }
    };

    const renderAdminLinks = () => {
        if (location.pathname === '/AdminHome') {
            return (
                <>
                   <Nav.Link as={Link} to="/AdminHome">Home</Nav.Link>
      <Nav.Link as={Link} to="/forum">Community Forum</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/create-post">Create Post</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/sections">Manage Sections</Nav.Link>
      <Nav.Link as={Link} to="/AdminHome/upload-quiz">Upload Quiz</Nav.Link> 
      <Nav.Link as={Link} to="/">Role Select</Nav.Link> 
                </>
            );
        } else if (location.pathname === '/AdminHome/forum') {
            return (
                <>
                    <Nav.Link as={Link} to="/AdminHome/create-post">Create Post</Nav.Link>
                    <Nav.Link as={Link} to="/AdminHome">Back to Home</Nav.Link>
                    <Nav.Link as={Link} to="/">Role Select</Nav.Link>
                </>
            );
        }
        return <Nav.Link as={Link} to="/AdminHome">Back to Home</Nav.Link>;
    };
    const renderUserLinks = () => {
        if (location.pathname === '/Home') {
            return (
                <>
                    <Nav.Link as={Link} to="/Home/forum">Community Forum</Nav.Link>
                    <Nav.Link as={Link} to="/Home/chatbot">Chatbot</Nav.Link>
                    <Nav.Link as={Link} to="/Home/sections">Explore Sections</Nav.Link>
                    <Nav.Link as={Link} to="/Home/quizzes">View Quizzes</Nav.Link>
                    <Nav.Link as={Link} to="/">Role Select</Nav.Link>
                </>
            );
        } else if (location.pathname === '/Home/forum') {
            return <Nav.Link as={Link} to="/Home">Back to Home</Nav.Link>;
            <Nav.Link as={Link} to="/">Role Select</Nav.Link>
        }
        return <Nav.Link as={Link} to="/Home">Back to Home</Nav.Link>;
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

const App = () => {
    const [role, setRole] = useState(null);
    const [posts, setPosts] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    //const navigate = useNavigate();
    
      const handleRoleSelection = (selectedRole) => {
          setRole(selectedRole);
          console.log("hi you've selected role");
          console.log('Selected Role:', selectedRole);
      };
    

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
    if(role===null){
    return <RoleSelection onSelectRole={handleRoleSelection} />;
    }
    else{
        
    return (
        <Router>
            <Container>
                <DynamicNavbar role={role} /> {}
                {loading && <Alert variant="info">Loading posts...</Alert>} 
                {error && <Alert variant="danger">{error}</Alert>} 
                <Routes>
                <Route path="/" element={<RoleSelection onSelectRole={handleRoleSelection} />} />
    <Route path="/Home" element={<Home />} />
    <Route path="/AdminHome" element={<AdminHome />} />
    <Route path="/Home/forum" element={<PostList posts={posts} setPosts={setPosts} />} />
    <Route path="/Home/create-post" element={<PostForm onPostCreated={handlePostCreated} />} />
    <Route path="/AdminHome/create-post" element={<PostForm onPostCreated={handlePostCreated} />} />
    <Route path="/Home/chatbot" element={<Chatbot />} />
    <Route path="/Home/sections" element={<Sections />} /> 
    <Route path="/AdminHome/sections" element={<Sections />} /> 
    <Route path="/Home/quizzes" element={<QuizList />} />
    <Route path="/AdminHome/upload-quiz" element={<QuizUpload />} />
    <Route path="/AdminHome/quiz/:id" element={<QuizDetails />} />
</Routes>
            </Container>
        </Router>
    );

};
};

<<<<<<< HEAD
=======
const DynamicNavbar = () => {
    const location = useLocation(); 
    //const role = getUserRole();

    const renderLinks = () => {
        // if (role === 'admin') {
          //return renderAdminLinks();
        // } else {
           return renderUserLinks();
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
>>>>>>> 66f359201859d42d928a9b28e63b1ab0c66abfef

export default App;