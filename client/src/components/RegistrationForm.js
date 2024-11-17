import React, { useState } from 'react';
import { Form, Button, InputGroup, Row, Col, Alert } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegistrationForm.css';
const url = process.env.REACT_APP_BACKURL;
const RegistrationForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        location: '',
        username: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data before submission:', formData);

        try {
            const response = await fetch(`${url}/api/users/register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Server didn't return JSON!");
            }

            const result = await response.json();
            console.log('Server response:', result);

            if (response.ok) {
                setSuccessMessage('Registration successful!');
                setErrorMessage('');
                // Clear form data
                setFormData({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    location: '',
                    username: ''
                });
            } else {
                setErrorMessage(result.message || 'Registration failed. Please try again.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            if (error.name === 'TypeError' && error.message === "Server didn't return JSON!") {
                setErrorMessage('Server response was not in the correct format. Please try again later.');
            } else {
                setErrorMessage('An error occurred. Please check your network connection and try again.');
            }
            setSuccessMessage('');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="registration-form">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <InputGroup>
                            <InputGroup.Text>
                                <FaUser />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <InputGroup>
                            <InputGroup.Text>
                                <FaUserCircle />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <InputGroup>
                    <InputGroup.Text>
                        <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
                <InputGroup>
                    <InputGroup.Text>
                        <FaPhone />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
                <InputGroup>
                    <InputGroup.Text>
                        <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button 
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
                <InputGroup>
                    <InputGroup.Text>
                        <FaMapMarkerAlt />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
                Register
            </Button>
        </Form>
    );
};

export default RegistrationForm;
