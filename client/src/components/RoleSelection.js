import React, { useState, useEffect } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import './RoleSelection.css';

// Particle animation initialization
const NUM_PARTICLES = 600;
const PARTICLE_SIZE = 0.5; // View heights
const SPEED = 20000; // Milliseconds

let particles = [];

function rand(low, high) {
    return Math.random() * (high - low) + low;
}

function createParticle(canvas) {
    const colour = {
        r: 255,
        g: rand(100, 160),
        b: 50,
        a: rand(0, 1),
    };
    return {
        x: -2,
        y: -2,
        diameter: Math.max(0, rand(PARTICLE_SIZE * 0.5, PARTICLE_SIZE)),
        duration: rand(SPEED, SPEED * 1.2),
        amplitude: rand(14, 18),
        offsetY: rand(0, 10),
        arc: Math.PI * 2,
        startTime: performance.now() - rand(0, SPEED),
        colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
    };
}

function moveParticle(particle, canvas, time) {
    const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
    return {
        ...particle,
        x: progress,
        y: ((Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY),
    };
}

function drawParticle(particle, canvas, ctx) {
    const vh = canvas.height / 100;
    ctx.fillStyle = particle.colour;
    ctx.beginPath();
    ctx.ellipse(
        particle.x * canvas.width,
        particle.y * vh + (canvas.height / 2),
        particle.diameter * vh,
        particle.diameter * vh,
        0,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

function draw(time, canvas, ctx) {
    particles.forEach((particle, index) => {
        particles[index] = moveParticle(particle, canvas, time);
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        drawParticle(particle, canvas, ctx);
    });

    requestAnimationFrame((time) => draw(time, canvas, ctx));
}

function initializeCanvas() {
    const canvas = document.getElementById('particle-canvas');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    });

    return [canvas, ctx];
}

function startAnimation() {
    const [canvas, ctx] = initializeCanvas();
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(createParticle(canvas));
    }

    requestAnimationFrame((time) => draw(time, canvas, ctx));
}

const RoleSelection = ({ onSelectRole, onLoginSuccess }) => {
    const [showForms, setShowForms] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [selectedRole, setSelectedRole] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        startAnimation(); // Start particle animation on mount
    }, []);

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
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    username: selectedRole === 'user' ? username : undefined,
                    adminId: selectedRole === 'admin' ? username : undefined,
                    password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('username', username);
                localStorage.setItem('token', result.token);
                localStorage.setItem('id', result._id);
                if (selectedRole === 'admin') {
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
            <canvas id="particle-canvas"></canvas> {/* Particle Canvas Element */}

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
                            <h4 style ={{color:'red',fontSize:'1.5rem'}}>Please Sign In or Sign Up</h4>
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
                        <h4 style ={{color:'red',fontSize:'2rem'}}>Admin Sign In</h4>
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
