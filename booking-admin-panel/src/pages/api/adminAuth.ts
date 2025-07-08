// src/services/adminAuth.ts
import api from '@/lib/axios';

//import axios from 'axios';

/**
 * Logs in the admin using session-based authentication.
 * Backend must use Spring Security with formLogin().
 * 
 * @param email Admin email
 * @param password Admin password
 * @returns Axios response promise
 */
type AdminLoginResponse = {
  token: string;
};

export const adminLogin = async (
  email: string,
  password: string
): Promise<void> => {
  const response = await api.post<AdminLoginResponse>('/api/admin-login', {
    email,
    password,
  });

  const token = response.data.token;

  console.log("Received token:", token); // this is for debugging

  if (token) {
    console.log("Saving token:", token); // this for debugging
    localStorage.setItem('admin_token', token);
  }


};

export const adminLogout = async () => {
  localStorage.removeItem('admin_token');
};



