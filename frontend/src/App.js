import React, { useState } from 'react';
import axios from 'axios';

// Get the backend base URL from environment variable
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// --- REAL API Call for Registration ---
const realApiRegister = async (fullName, email, username, password) => {
  try {
    const response = await axios.post(`${API_BASE}/api/auth/register`, {
      fullName,
      email,
      username,
      password,
    });
    return { message: 'Registration successful! Please log in.' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// --- REAL API Call for Login ---
const realApiLogin = async (usernameOrEmail, password) => {
  try {
    const response = await axios.post(`${API_BASE}/api/auth/login`, {
      usernameOrEmail,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
