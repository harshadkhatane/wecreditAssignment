import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './api';
import './App.css';


const Register = () => {
  const [mobile, setMobile] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!mobile.trim() || !deviceId.trim()) {
      setError('Mobile number and Device ID are required');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Invalid mobile number. Please enter a valid 10-digit number.');
      return;
    }

    setError('');
    try {
      const response = await registerUser(mobile, deviceId); // Call the Register API
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 2000); // Redirect to login page
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Error: Unable to register. Please try again.');
    }
  };

  return (
    <div className="container">
    <h2>Register</h2>
    <input
      type="text"
      placeholder="Enter Mobile Number"
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
    />
    <input
      type="text"
      placeholder="Enter Device ID"
      value={deviceId}
      onChange={(e) => setDeviceId(e.target.value)}
    />
    <button onClick={handleRegister}>Register</button>
    {error && <p className="error">{error}</p>}
    {message && <p className="success">{message}</p>}
  </div>
  );
};

export default Register;
