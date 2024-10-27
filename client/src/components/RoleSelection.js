import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RoleSelection = ({ onSelectRole }) => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        onSelectRole(role);
        // Navigate to appropriate page based on role
        if (role === 'admin') {
            navigate('/AdminHome');  // Admin Home page
        } else if (role === 'user') {
            navigate('/Home');  // User Home page
        }
    };

    return (
        <Container className="role-selection-container text-center mt-5">
            <h2>Select Your Role</h2>
            <Button 
                variant="primary" 
                className="m-3" 
                onClick={() => handleRoleSelection('admin')}
            >
                Admin
            </Button>
            <Button 
                variant="secondary" 
                className="m-3" 
                onClick={() => handleRoleSelection('user')}
            >
                User
            </Button>
        </Container>
    );
};

export default RoleSelection;
