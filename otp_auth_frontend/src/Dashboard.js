import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to OTP Auth System</h1>
      <div>
        <button
          onClick={() => navigate('/register')}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Register
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '10px 20px' }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
