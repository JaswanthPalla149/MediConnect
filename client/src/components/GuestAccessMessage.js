import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const GuestAccessMessage = ({ resetAuth }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        resetAuth();
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Card style={{ width: "400px", padding: "20px", textAlign: "center", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                <h2 style={{ color: "#1ABC9C", fontFamily: "Roboto", marginBottom: "20px" }}>
                    Limited Access
                </h2>
                <p style={{ fontSize: "1rem", marginBottom: "20px" }}>
                    You are currently browsing as a guest. Please sign up to unlock all features, including creating posts, using the dashboard, and chatting with chatbot.
                </p>
                <Button variant="success" onClick={handleRedirect} style={{ width: "100%", fontSize: "1rem" }}>
                    Sign Up Now
                </Button>
            </Card>
        </div>
    );
};

export default GuestAccessMessage;
