// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('user'); // Default role
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // TODO: Add real authentication logic (API call to verify user)

        // For now, assume login is successful and set the role
        setRole(selectedRole);

        // Navigate to the respective dashboard based on role
        if (selectedRole === 'user') {
            navigate('/dashboard');
        } else if (selectedRole === 'admin') {
            navigate('/admin-dashboard');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;