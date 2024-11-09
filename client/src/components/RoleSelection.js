import React, { useState } from 'react';
import { Container, Button, Card, Alert } from 'react-bootstrap';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import './RoleSelection.css';

const RoleSelection = ({ onSelectRole, onLoginSuccess }) => {
    const [showForms, setShowForms] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [selectedRole, setSelectedRole] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRoleSelection = (role) => {
        onSelectRole(role);
        setSelectedRole(role);
        setShowForms(true);
        setIsLogin(true);
    };

    const toggleForm = (formType) => {
        setIsLogin(formType === 'login');
    };

    const onLogin = async (username, password) => {
        console.log(`Logging in with username: ${username} and password: ${password}`);
        setLoading(true);
        setErrorMessage(null); // Reset error message

        try {
            const loginUrl = selectedRole === 'admin' 
                ? 'http://localhost:5000/api/admins/login' 
                : 'http://localhost:5000/api/users/login'; 
    
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: selectedRole === 'user' ? username : undefined,
                    adminId: selectedRole === 'admin' ? username : undefined,
                    password
                }),
            });
    
            const result = await response.json();
            
            if (response.ok) {
                console.log('Login successful:', result);
                localStorage.setItem('username', username);
                console.log(`username after succesfull login: ${username}`);
                localStorage.setItem('token', result.token);
                localStorage.setItem('id',result._id);
                onLoginSuccess(username,result._id, selectedRole); // Notify App.js of successful login
            } else {
                console.error('Login failed:', result.message);
                setErrorMessage(result.message); // Show error message to user
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Error during login. Please try again.'); // Show generic error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="role-selection-container text-center mt-5">
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

            {showForms && (
                <div className="mt-4">
                    {selectedRole === 'user' ? (
                        <>
                            <h4>Please Sign In or Sign Up</h4>
                            <div className="d-flex justify-content-around mb-4">
                                <Button 
                                    variant="outline-primary" 
                                    className="m-2" 
                                    onClick={() => toggleForm('signup')}
                                >
                                    Sign Up
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    className="m-2" 
                                    onClick={() => toggleForm('login')}
                                >
                                    Sign In
                                </Button>
                            </div>
                        </>
                    ) : (
                        <h4>Admin Sign In</h4>
                    )}

                    <Card className="p-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        {loading ? (
                            <p>Loading...</p> // You can replace this with a spinner if needed
                        ) : (
                            isLogin || selectedRole === 'admin' ? (
                                <div>
                                    <h5>Sign In</h5>
                                    <LoginForm onLogin={onLogin} />
                                </div>
                            ) : (
                                <div>
                                    <h5>Sign Up</h5>
                                    <RegistrationForm /> {/* Ensure RegistrationForm has onSubmit logic */}
                                </div>
                            )
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default RoleSelection;
