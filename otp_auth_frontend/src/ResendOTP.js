import React, { useState } from 'react';
import { resendOTP } from './api';

const ResendOTP = () => {
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP(mobile);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Resend OTP</h2>
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={handleResendOTP}>Resend OTP</button>
      <p>{message}</p>
    </div>
  );
};

export default ResendOTP;
