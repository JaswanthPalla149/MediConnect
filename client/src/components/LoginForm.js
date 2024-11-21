import React, { useState } from 'react';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = ({ role, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginData = role === 'admin'
            ? { adminId: username, password }
            : { username, password };

        console.log('Login Data:', loginData);

        // Call the onLogin function and handle the error
        onLogin(username, password).catch((err) => {
            setError(err.message || 'Login failed. Please try again.'); // Update the error state
        });
    };

    return (
        <Form onSubmit={handleSubmit} className="login-form">
            <h3>{'Login'}</h3>
            {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}

            <Form.Group controlId="loginUsername" className="mb-3">
                <Form.Label>{role === 'user' ? 'Username' : 'Admin Id'}</Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder={role === 'admin' ? 'Enter Admin ID' : 'Enter Username'}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        aria-label={role === 'admin' ? 'Admin ID' : 'Username'} // Accessibility improvement
                    />
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="loginPassword" className="mb-4">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="Password" // Accessibility improvement
                    />
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility improvement
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
                Log In
            </Button>

            <div className="text-center mt-3">
                <a href="#" className="text-muted">Forgot password?</a>
            </div>
        </Form>
    );
};

export default LoginForm;
