import axios from 'axios';
import { getToken, logout } from './auth';

//export const baseUrl = 'http://localhost:5007/ennore-delivery/';
export const baseUrl = 'https://ennore-delivery-api.onrender.com/ennore-delivery/'; // for production

// Create axios instance with base URL and default headers (without Authorization for now)
export const api = axios.create({
  baseURL: baseUrl, 
  headers: {
    'Content-Type': 'application/json'
  },
});

// Request Interceptor: Set Authorization dynamically based on the current token
api.interceptors.request.use((config) => {
  const token = getToken() || localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle redirects and token expiry
api.interceptors.response.use(
  (response) => {
    // Return the response data as usual if no redirect
    return response;
  },
  (error) => {
    console.log("Intercepted response error:", error);

    // Check if the response has a 302 status code (indicating a redirect)
    if (error.response && error.response.status === 302) {
      // Get the redirect URL from the response data or headers
      const redirectUrl = error.response.data?.redirectUrl || error.response.headers['location'];

      if (redirectUrl) {
        logout(); // Log the user out if the token is invalid or expired
        // If a redirect URL is present, redirect the user to that URL
        console.log('Redirecting to:', redirectUrl); // Log the redirect URL for debugging
        window.location.href = redirectUrl; // This will perform a full page redirect to the signin page
      }
    }

    // If it's not a redirect error, reject the promise and pass the error along
    return Promise.reject(error);
  }
);

