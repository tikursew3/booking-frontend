// src/services/adminAuth.ts
//import api from '@/lib/axios';
import axios from 'axios';

/**
 * Logs in the admin using session-based authentication.
 * Backend must use Spring Security with formLogin().
 * 
 * @param email Admin email
 * @param password Admin password
 * @returns Axios response promise
 */
export const adminLogin = async (email: string, password: string) => {

  return axios.post(
    'https://photography-booking.onrender.com/api/admin-login',
    {
        email,
        password
      },
      {
        withCredentials: true, // Important for session cookies
        headers: {
          'Content-Type': 'application/json', // Send JSON now (not form-urlencoded)
        },
      }
  );
};


/**
 * Logs out the admin by clearing the session cookie.
 */
export const adminLogout = async () => {
  return axios.post('https://photography-booking.onrender.com/api/admin-logout', null, {
    withCredentials: true,
  });
};
