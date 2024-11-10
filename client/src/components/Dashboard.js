// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colors for pie chart slices

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Fetch the dashboard data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/user/dashboard'); // Replace with your API URL
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>User Dashboard</h1>

      {/* Happiness and Mindfulness Level - Bar Chart */}
      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ width: '45%' }}>
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
        <div style={{ width: '45%' }}>
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
        <ul style={{ listStyleType: 'none' }}>
          {dashboardData.quizScores.map((score, index) => (
            <li key={index} style={{ marginBottom: '10px', color: 'white' }}>
              Quiz {index + 1}: {score.score} (Date: {new Date(score.timestamp).toLocaleDateString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
