import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import UserDetails from './UserDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-details" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
