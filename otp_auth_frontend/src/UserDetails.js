import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserDetails } from './api';

const UserDetails = () => {
  const [user, setUser] = useState(null); // State to hold user data
  const [error, setError] = useState(''); // State for errors
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mobile = queryParams.get('mobile'); // Extract mobile number from query string

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching user details for mobile: ${mobile}`);
        const response = await fetchUserDetails(mobile);
        console.log('API Response:', response.data);
        setUser(response.data.user); // Update user state
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Error fetching user details: ' + err.message);
      }
    };

    if (mobile) {
      fetchData();
    }
  }, [mobile]);

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!user) {
    return <p style={{ textAlign: 'center' }}>Loading user details...</p>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>User Details</h2>
      <p><strong>Mobile:</strong> {user.mobile || 'N/A'}</p>
      <p><strong>Devices:</strong></p>
      {Array.isArray(user.devices) && user.devices.length > 0 ? (
        <ul>
          {user.devices.map((device, index) => (
            <li key={index}>
              <strong>Device ID:</strong> {device.device_id} | <strong>Last Logged In:</strong> {device.last_logged_in}
            </li>
          ))}
        </ul>
      ) : (
        <p>No devices available</p>
      )}
    </div>
  );
};

export default UserDetails;
