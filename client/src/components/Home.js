import React from "react";
import "@splinetool/viewer";
import { Link } from "react-router-dom";
import './Home.css';
import { motion } from 'framer-motion';

const Home = ({ id }) => {
  return (
    <motion.div className="home-container">
      <div className="home">
        {/* Home Image Section with scroll animation */}
        <motion.div 
          className="home-img"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/000/390/394/original/mental-health-awareness-icon-vector.jpg"
            alt="Mental Health"
          />
        </motion.div>

        {/* Home Content with scroll animation */}
        <motion.div 
          className="home-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h3 className="typing-text" 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Welcome to Our Platform
          </motion.h3>

          <motion.p 
            className="homepara"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span style={{ fontSize: "2rem" }}>" </span>
            Our mission is to foster mental well-being and community support.
            Explore the chatbot, community forum, and other sections to stay connected and informed.
            <span style={{ fontSize: "2rem" }}>" </span>
          </motion.p>

          <div className="button-container">
            <Link to="/Home/chatbot">
              <button className="custom-button chatbot-btn">Chatbot</button>
            </Link>
            <Link to="/Home/forum/select-domain">
              <button className="custom-button forum-btn">Community Forum</button>
            </Link>
            <Link to="/Home/sections">
              <button className="custom-button mental-btn">Mental Health Resources</button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Chatbot Section with scroll animation */}
      <motion.div 
        className="page2"
        id="chatbot"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7,
          ease: "easeInOut",}}
      >
        <div className="spline-container">
          <spline-viewer
            url="https://prod.spline.design/iElCLyBL4DC9lZSW/scene.splinecode"
            style={{ width: "100%", height: "550px" }}
          />
        </div>
        <div className="text-container">
          <h2 style={{ color: '#00e6e6', fontWeight: '1000', fontSize: '2.5rem',fontFamily:'Lora'}}> Mental Health Chatbot</h2>
          <p style={{ color: 'whitesmoke', fontSize: '1.5rem' }} id = "chatbot-txt">
            If you're feeling overwhelmed, don't hesitate to reach out to our chatbot for support.
            You're not alone, and help is just a message away.
          </p>
        </div>
      </motion.div>

      {/* Community Section with scroll animation */}
      <motion.div
        className="community"
        id="community"
        style={{ marginTop: '8rem' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="community" id="community" style = {{marginTop:'8rem'}}>
          <div className="spline-container">
          <spline-viewer
            url="https://prod.spline.design/3nUiXob4AEk5Ygug/scene.splinecode"
            style={{ width: "100%", height: "500px" }}
          />
           </div>
  </div>
        
        <div className="community-container" style={{ marginTop: "20px", marginLeft: "20px" }}>
          <h2 style={{ color: '#00e6e6', fontWeight: '1000', fontSize: '2.5rem',fontFamily: 'Lora'}}>Community Support</h2>
          <p style={{ color: 'whitesmoke', fontSize: '1.5rem' }}>
            Join our community to connect with others who share similar experiences.
            Support each other, share resources, and grow together. Your voice matters!
          </p>
          <p style={{ color: 'whitesmoke', fontSize: '1.5rem' }}>Stay tuned for upcoming events and discussions!</p>
        </div>
      </motion.div>

      {/* Quizzes Section with scroll animation */}
      <motion.div
        className="quizzes-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="quiz-img">
          <h2 style={{ color: '#00e676', fontWeight: '1000', fontSize: '4rem' }}>QUIZZES</h2>
          <img
            src="https://binghomepageweeklyquiz.com/wp-content/uploads/2022/04/mental-health-quiz.jpg"
            alt="Quizzes"
          />
        </div>
        <motion.div
          className="quiz-textbox"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="quiz-description" style={{ fontSize: '1.5rem' }}>
            A quiz can't tell you everything you need to know about yourself, but it can help provide insight into some of your personality traits, behaviors, and how you view and respond to the world around you.
          </p>
        </motion.div>
      </motion.div>

      {/* Explore Sections with scroll animation */}
      <motion.div 
        className="explore-sections"
        id="explore"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-center mt-5" style={{ color: '#00e6e6', fontWeight: '1000', fontSize: '2.5rem',fontFamily:'Lora' }}>Explore Sections</h2>
        <p className="text-center" style={{ color: 'whitesmoke', fontSize: '1.5rem' }}>
          Discover our resources and participate in exciting workshops and community events!
        </p>
        <div className="button-container">
          <Link to="/workshops">
            <button className="custom-button workshops-btn">Upcoming Workshops</button>
          </Link>
          <Link to="/events">
            <button className="custom-button events-btn">Community Events</button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;