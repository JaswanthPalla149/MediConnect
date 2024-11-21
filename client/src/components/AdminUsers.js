import React, { useState, useEffect } from 'react';
const url = process.env.REACT_APP_BACKURL;

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
                // Filter users based on matching domain or location, case-insensitive comparison
                console.log('Fetching users for domain or location:', adminDomain);
                const filteredUsers = result.filter(user =>
                    (user.domain && user.domain.toLowerCase() === adminDomain.toLowerCase()) ||
                    (user.location && user.location.toLowerCase() === adminDomain.toLowerCase())
                );

                console.log('Filtered Users:', filteredUsers);  // Log filtered users to check the results

                const sortedUsers = filteredUsers.sort((a, b) => {
                    // Ensure levels are numbers, default to 0 if undefined or null
                    const levelA = a[`${adminDomain}Level`] || 0;
                    const levelB = b[`${adminDomain}Level`] || 0;

                    // Sort by domain-specific level if both users have the same domain
                    if (a.domain === adminDomain && b.domain === adminDomain) {
                        return levelA - levelB; // Ascending order of domain level
                    } else {
                        // If domains do not match, sort by total wellness level
                        const totalWellnessA = (a.happinessLevel || 0) + (a.mindfulnessLevel || 0) + (a.engagementLevel || 0);
                        const totalWellnessB = (b.happinessLevel || 0) + (b.mindfulnessLevel || 0) + (b.engagementLevel || 0);
                        return totalWellnessA - totalWellnessB; // Ascending order of total wellness level
                    }
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
    }, [adminDomain]);  // Corrected dependency array

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Users in {adminDomain}</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id} style={{ color: '#66b3b7' }}>  {/* Light teal color */}
                            <p className="light-text">Name: {user.name}</p>
                            <p className="light-text">Location: {user.location}</p>
                            <p className="light-text">Phone Number: {user.phoneNumber}</p> {/* Display phone number */}
                            <p style={{ color: '#66b3b7' }}>Wellness Status: {user.wellnessStatus}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found for this domain/location.</p>
            )}
        </div>
    );
};

export default AdminUsers;
