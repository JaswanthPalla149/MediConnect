import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import './Footer.css'; // Import the CSS file for additional styling

const Footer = () => {
    return (
        <Navbar bg="dark" variant="dark" className="footer-navbar">
            <div className="footer-inner">
                <Navbar.Brand as={Link} to="/" className="footer-brand">
                    Manaswini
                </Navbar.Brand>
                <Nav className="me-auto footer-links">
                    <Nav.Link as={Link} to="/Home">Home</Nav.Link>

                    {/* Community Forum with indented links below it */}
                    <div className="footer-community-forum-container">
                        <Nav.Link as={Link} to="/Home/forum/select-domain" className="footer-community-forum">
                            Community Forum
                        </Nav.Link>

                        {/* Indented links below the Community Forum */}
                        <div className="footer-submenu">
                            <Nav.Link as={Link} to="/Home/forum/engagement" className="footer-submenu-link">
                                Engagement
                            </Nav.Link>
                            <Nav.Link as={Link} to="/Home/forum/happiness" className="footer-submenu-link">
                                Happiness
                            </Nav.Link>
                            <Nav.Link as={Link} to="/Home/forum/mindfulness" className="footer-submenu-link">
                                Mindfulness
                            </Nav.Link>
                        </div>
                    </div>

                    <Nav.Link as={Link} to="/Home/quizzes">Quizzes</Nav.Link>
                    <Nav.Link as={Link} to="/Home/sections">Explore Sections</Nav.Link>
                    <Nav.Link as={Link} to="/Home/YogaPage">Yoga</Nav.Link>
                    <Nav.Link as={Link} to="/Home/ChatPage">ChatUs</Nav.Link>
                    <Nav.Link as={Link} to="/Home/Dboard">DashBoard</Nav.Link>

                </Nav>
                <Nav className="ml-auto footer-socials">
                    <Nav.Link href="https://facebook.com" target="_blank">Facebook</Nav.Link>
                    <Nav.Link href="https://twitter.com" target="_blank">Twitter</Nav.Link>
                    <Nav.Link href="https://instagram.com" target="_blank">Instagram</Nav.Link>
                </Nav>
            </div>
        </Navbar>
    );
};

export default Footer;
