import React, { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
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
        setShowForms(true); // Show the form section
        setIsLogin(true); // Default to login form
    };

    const toggleForm = (formType) => {
        setIsLogin(formType === 'login');
    };

    const onLogin = async (username, password) => {
        setLoading(true);
        setErrorMessage(null);

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
                localStorage.setItem('username', username);
                localStorage.setItem('token', result.token);
                localStorage.setItem('id', result._id);
                if (selectedRole === "admin") {
                    localStorage.setItem('domain', result.domain);
                }
                onLoginSuccess(username, result._id, selectedRole, result.domain);
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage('Error during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`role-selection-container ${showForms ? 'hide-background' : ''}`}>
            {!showForms && (
                <div className="role-selection-wrapper">
                    <h2>Select Your Role</h2>
                    <div className="role-buttons">
                        <Button
                            variant="primary"
                            className="role-button"
                            onClick={() => handleRoleSelection('admin')}
                        >
                            Admin
                        </Button>
                        <Button
                            variant="secondary"
                            className="role-button"
                            onClick={() => handleRoleSelection('user')}
                        >
                            User
                        </Button>
                    </div>
                </div>
            )}

            {showForms && (
                <div className="form-section">
                    {selectedRole === 'user' ? (
                        <>
                            <h4>Please Sign In or Sign Up</h4>
                            <div className="d-flex justify-content-around mb-4">
                                <Button
                                    variant="outline-primary"
                                    onClick={() => toggleForm('signup')}
                                >
                                    Sign Up
                                </Button>
                                <Button
                                    variant="outline-secondary"
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
                            <p>Loading...</p>
                        ) : (
                            isLogin || selectedRole === 'admin' ? (
                                <LoginForm onLogin={onLogin} />
                            ) : (
                                <RegistrationForm />
                            )
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default RoleSelection;
