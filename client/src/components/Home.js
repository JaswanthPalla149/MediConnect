import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Home.css';  // Importing the Home.css styles

const Home = () => {
  return (
    <div className="home-container">
      <section className="home">
        <div className="home-img">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/000/390/394/original/mental-health-awareness-icon-vector.jpg" 
            alt="Mental Health" 
          />
        </div>

        <div className="home-content">
          <h3 className="typing text">Welcome to Our Platform</h3>
          <p>
            Our mission is to foster mental well-being and community support. 
            Explore the chatbot, community forum, and other sections to stay connected and informed.
          </p>

          <Row className="text-center mt-5">
            <Col md={4}>
              <Link to="/forum">
                <Button variant="primary" className="w-100 mb-3">Community Forum</Button>
              </Link>
            </Col>
            <Col md={4}>
              <Link to="/chatbot">
                <Button variant="secondary" className="w-100 mb-3">Chatbot</Button>
              </Link>
            </Col>
            <Col md={4}>
              <Link to="/sections">
                <Button variant="success" className="w-100">Explore Sections</Button>
              </Link>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Home;
