// src/services/adminAuth.ts
import api from '@/lib/axios';

/**
 * Logs in the admin using session-based authentication.
 * Backend must use Spring Security with formLogin().
 * 
 * @param email Admin email
 * @param password Admin password
 * @returns Axios response promise
 */
export const adminLogin = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  return api.post(
    '/login',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
};
