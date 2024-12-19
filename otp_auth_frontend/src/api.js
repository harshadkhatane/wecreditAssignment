import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const registerUser = async (mobile, deviceId) => {
  console.log(`Registering user: ${mobile}, Device ID: ${deviceId}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { mobile, device_id: deviceId });
    console.log('Register Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error in registerUser:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (mobile, otp, deviceId) => {
  console.log(`Logging in user: ${mobile}, OTP: ${otp}, Device ID: ${deviceId}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { mobile, otp, device_id: deviceId });
    console.log('Login Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error in loginUser:', error.response?.data || error.message);
    throw error;
  }
};

export const getOTP = async (mobile, deviceId) => {
  console.log(`Requesting OTP for: ${mobile}, Device ID: ${deviceId}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/get-otp`, { mobile, device_id: deviceId });
    console.log('Get OTP Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error in getOTP:', error.response?.data || error.message);
    throw error;
  }
};

export const resendOTP = async (mobile) => {
  console.log(`Resending OTP for: ${mobile}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/resend-otp`, { mobile });
    console.log('Resend OTP Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error in resendOTP:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchUserDetails = async (mobile) => {
  console.log(`Fetching user details for: ${mobile}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/user-details`, { params: { mobile } });
    console.log('Fetch User Details Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error in fetchUserDetails:', error.response?.data || error.message);
    throw error;
  }
};
