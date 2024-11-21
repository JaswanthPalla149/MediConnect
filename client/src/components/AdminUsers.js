import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Container, Grid, Card, Typography, Paper } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
const url = process.env.REACT_APP_BACKURL;

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminUsers = ({ adminDomain }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to fetch users based on admin's domain and location
    const fetchUsers = async (adminDomain) => {
        try {
            // Fetch all users from the API
            const response = await fetch(`${url}/api/users`);
            const result = await response.json();

            console.log('API Response:', result);  // Log the full API response to check its structure

            if (response.ok) {
                let filteredUsers = [];

                if (['engagement', 'happiness', 'mindfulness'].includes(adminDomain.toLowerCase())) {
                    // Show all users if adminDomain is one of the special domains
                    filteredUsers = result;
                } else {
                    // Filter users based on matching domain or location
                    console.log('Fetching users for domain or location:', adminDomain);
                    filteredUsers = result.filter(user =>
                        (user.domain && user.domain.toLowerCase() === adminDomain.toLowerCase()) ||
                        (user.location && user.location.toLowerCase() === adminDomain.toLowerCase())
                    );
                }

                console.log('Filtered Users:', filteredUsers);  // Log filtered users to check the results

                const sortedUsers = filteredUsers.sort((a, b) => {
                    // Sorting by wellness level
                    const levelA = a[`${adminDomain}Level`] || 0;
                    const levelB = b[`${adminDomain}Level`] || 0;
                    return levelA - levelB;
                });

                setUsers(sortedUsers);  // Store the sorted users in state
            } else {
                setError(result.message || 'Error fetching users');
            }
        } catch (error) {
            setError('An error occurred while fetching users');
        } finally {
            setLoading(false);  // Set loading to false after fetching is done
        }
    };

    // Fetch users when the component mounts or when adminDomain changes
    useEffect(() => {
        if (adminDomain) {
            fetchUsers(adminDomain);
        }
    }, [adminDomain]);

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const getLevelData = (user, adminDomain) => {
        const level = user[`${adminDomain}Level`] || 0;
        return (level + 1) * 50;  // Scale the level for visualization (0–100)
    };

    return (
        <div>
            <h2 style={{ color: 'limegreen' }}>Users in {adminDomain}</h2>

            {users.length > 0 ? (
                <div>
                    {users.map(user => (
                        <Grid container spacing={3} key={user._id}>
                            <Grid item xs={12} md={6}>
                                <Card className="dashboard-card">
                                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                        <Typography variant="h6">{user.name}</Typography>

                                        {/* Bar chart for specific domain level */}
                                        <Bar
                                            data={{
                                                labels: [adminDomain.charAt(0).toUpperCase() + adminDomain.slice(1)],
                                                datasets: [
                                                    {
                                                        label: `${adminDomain.charAt(0).toUpperCase() + adminDomain.slice(1)} Level`,
                                                        data: [getLevelData(user, adminDomain)],
                                                        backgroundColor: ['#4caf50'],
                                                        borderColor: ['#388e3c'],
                                                        borderWidth: 1,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    title: { display: true, text: `${adminDomain.charAt(0).toUpperCase() + adminDomain.slice(1)} Level` },
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        max: 100,
                                                    },
                                                },
                                            }}
                                        />
                                    </Paper>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card className="dashboard-card">
                                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                        <Typography variant="h6">Details</Typography>
                                        <p className="light-text">Location: {user.location}</p>
                                        <p className="light-text">Phone Number: {user.phoneNumber}</p>
                                        <p className="light-text">Wellness Status: {user.wellnessStatus}</p>
                                    </Paper>
                                </Card>
                            </Grid>
                        </Grid>
                    ))}
                </div>
            ) : (
                <p>No users found for this domain/location.</p>
            )}
        </div>
    );
};

export default AdminUsers;
