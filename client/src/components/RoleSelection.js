import React from 'react';
import { Container, Button } from 'react-bootstrap';

const RoleSelection = ({ onSelectRole }) => {
    return (
        <Container className="role-selection-container text-center mt-5">
            <h2>Select Your Role</h2>
            <Button 
                variant="primary" 
                className="m-3" 
                onClick={() => onSelectRole('admin')}
            >
                Admin
            </Button>
            <Button 
                variant="secondary" 
                className="m-3" 
                onClick={() => onSelectRole('user')}
            >
                User
            </Button>
        </Container>
    );
};

export default RoleSelection;
