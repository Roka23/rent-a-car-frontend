// src/api/axiosInstance.ts

import axios from 'axios';
import { toast } from 'react-toastify';

// Create an instance of axios
const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Set your base API URL here
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
});

var currentToast: any = null;
// Intercept responses to handle global 401 errors
axiosClient.interceptors.response.use(
    response => response, // If the response is successful, just return it
    error => {
        if (error.response && error.response.status === 401) {
            // Handle 401 error: Notify the user and potentially redirect them to login
            if (!currentToast) {
                currentToast = toast.info("Your session has expired. Please log in!", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
            localStorage.removeItem('token'); // Clear the token from storage
            window.location.href = '/login'; // Redirect to the login page
        }
        return Promise.reject(error); // Reject the promise to propagate the error
    }
);

export default axiosClient;
