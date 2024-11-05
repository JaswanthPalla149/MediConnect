// UserAuth.js
import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';

const UserAuth = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleToggle = () => {
        setIsRegistering(!isRegistering);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const url = isRegistering ? '/api/users/register' : '/api/users/login';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(result);
    };

    return (
        <Container className="mt-5">
            <h2>{isRegistering ? 'User Registration' : 'User Login'}</h2>
            <Form onSubmit={handleSubmit}>
                {isRegistering && (
                    <>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" placeholder="Enter your name" required />
                        </Form.Group>
                    </>
                )}
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter your email" required />
                </Form.Group>
                <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phoneNumber" placeholder="Enter your phone number" required />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter your password" required />
                </Form.Group>
                {isRegistering && (
                    <>
                        <Form.Group controlId="formLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" name="location" placeholder="Enter your location" required />
                        </Form.Group>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" placeholder="Choose a username" required />
                        </Form.Group>
                    </>
                )}
                <Button variant="primary" type="submit">
                    {isRegistering ? 'Register' : 'Login'}
                </Button>
            </Form>
            <Button variant="link" onClick={handleToggle}>
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </Button>
        </Container>
    );
};

export default UserAuth;
