// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colors for pie chart slices

const Dashboard = ({ username, id }) => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Fetch the dashboard data for the specific user
    console.log(`In dashboard user id:${id}`);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Using token for authorization
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`setting data :${response}`);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [id]); // Fetch data when `id` changes

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a2e', minHeight: '100vh' }}>
      <h1>{username}'s Dashboard</h1>

      {/* Happiness and Mindfulness Level - Bar Chart */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h3>Happiness & Mindfulness Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Happiness', value: dashboardData.happinessLevel },
              { name: 'Mindfulness', value: dashboardData.mindfulnessLevel },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wellness Status - Pie Chart */}
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h3>Wellness Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Excellent', value: dashboardData.wellnessStatus === 'Excellent' ? 100 : 0 },
                  { name: 'Good', value: dashboardData.wellnessStatus === 'Good' ? 100 : 0 },
                  { name: 'Moderate', value: dashboardData.wellnessStatus === 'Moderate' ? 100 : 0 },
                  { name: 'Needs Attention', value: dashboardData.wellnessStatus === 'Needs Attention' ? 100 : 0 },
                ]}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
              >
                {['Excellent', 'Good', 'Moderate', 'Needs Attention'].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quiz Scores - Displaying the list of quiz scores */}
      <div style={{ marginTop: '30px' }}>
        <h3>Quiz Scores</h3>
        {dashboardData.quizScores.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {dashboardData.quizScores.map((score, index) => (
              <li key={index} style={{ marginBottom: '10px', color: 'white' }}>
                Quiz {index + 1}: {score.score} (Date: {new Date(score.timestamp).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p>No quiz scores available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
