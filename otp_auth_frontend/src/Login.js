import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, resendOTP, getOTP } from './api'; // Import the resendOTP function
import { getDeviceId } from './getDeviceId';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter Mobile and Device ID, Step 2: Enter OTP
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGetOTP = async () => {
    if (!mobile.trim()) {
      setError('Mobile number is required');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Invalid mobile number. Please enter a valid 10-digit number.');
      return;
    }

    setError('');
    try {
      const deviceID = await getDeviceId();
      // Simulate OTP API call
      console.log(`Sending OTP for mobile: ${mobile} with device ID: ${deviceID}`);
      setMessage('OTP sent successfully. Please enter the OTP.');
      setStep(2); // Move to Step 2
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Error sending OTP. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    try {
      // Resend OTP API call
      const response = await resendOTP(mobile);
      setMessage(response.data.message || 'OTP resent successfully.');
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Error resending OTP. Please try again.');
    }
  };

  const handleLogin = async () => {
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    setError('');
    try {
      const response = await loginUser(mobile, otp, deviceId); // Login API call
      setMessage(response.data.message);

      // Redirect to User Details page after successful login
      if (response.status === 200) {
        navigate(`/user-details?mobile=${mobile}`);
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Invalid or expired OTP. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      {step === 1 && (
        <div>
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
          <button onClick={handleGetOTP}>Get OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p>Mobile Number: {mobile}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          <button onClick={handleLogin} style={{ marginRight: '10px' }}>
            Login
          </button>
          <button className="secondary" onClick={() => setStep(1)}>Edit Mobile and Device ID</button>
          <button onClick={handleResendOTP}>Resend OTP</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default Login;
