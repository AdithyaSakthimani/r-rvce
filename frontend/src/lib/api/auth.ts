/**
 * Authentication API Module
 * Endpoints: /auth/*
 */

// import { apiRequest, API_BASE_URL } from './index';

// Types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupRecruiterPayload {
  email: string;
  password: string;
  name: string;
  company: string;
}

export interface SignupStudentPayload {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'recruiter' | 'admin';
  company?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refresh_token?: string;
  message?: string;
  error?: string;
}

export const authApi = {
  /**
   * Login as recruiter
   * POST /auth/login-recruiter
   */
  loginRecruiter: async (payload: LoginPayload): Promise<AuthResponse> => {
    // return await axios.post(`${API_BASE_URL}/auth/login-recruiter`, payload);
    // return await fetch('/auth/login-recruiter', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // }).then(res => res.json());
    
    console.log('API: loginRecruiter called with:', payload);
    return { success: true, message: 'Login placeholder' };
  },

  /**
   * Login as student
   * POST /auth/login-student
   */
  loginStudent: async (payload: LoginPayload): Promise<AuthResponse> => {
    // return await axios.post(`${API_BASE_URL}/auth/login-student`, payload);
    // return await fetch('/auth/login-student', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // }).then(res => res.json());
    
    console.log('API: loginStudent called with:', payload);
    return { success: true, message: 'Login placeholder' };
  },

  /**
   * Register recruiter account
   * POST /auth/signup-recruiter
   */
  signupRecruiter: async (payload: SignupRecruiterPayload): Promise<AuthResponse> => {
    // return await axios.post(`${API_BASE_URL}/auth/signup-recruiter`, payload);
    // return await fetch('/auth/signup-recruiter', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // }).then(res => res.json());
    
    console.log('API: signupRecruiter called with:', payload);
    return { success: true, message: 'Signup placeholder' };
  },

  /**
   * Register student account
   * POST /auth/signup-student
   */
  signupStudent: async (payload: SignupStudentPayload): Promise<AuthResponse> => {
    // return await axios.post(`${API_BASE_URL}/auth/signup-student`, payload);
    // return await fetch('/auth/signup-student', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // }).then(res => res.json());
    
    console.log('API: signupStudent called with:', payload);
    return { success: true, message: 'Signup placeholder' };
  },

  /**
   * Verify JWT token
   * POST /auth/verify-token
   */
  verifyToken: async (token: string): Promise<{ valid: boolean; user?: User }> => {
    // return await axios.post(`${API_BASE_URL}/auth/verify-token`, null, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await fetch('/auth/verify-token', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then(res => res.json());
    
    console.log('API: verifyToken called');
    return { valid: true };
  },

  /**
   * Refresh JWT token
   * POST /auth/refresh-token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    // return await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refresh_token: refreshToken });
    // return await fetch('/auth/refresh-token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ refresh_token: refreshToken }),
    // }).then(res => res.json());
    
    console.log('API: refreshToken called');
    return { success: true, message: 'Refresh placeholder' };
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async (): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/auth/logout`, null, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await fetch('/auth/logout', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then(res => res.json());
    
    console.log('API: logout called');
    return { success: true };
  },

  /**
   * Get user profile
   * GET /auth/profile
   */
  getProfile: async (): Promise<{ success: boolean; user?: User }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.get(`${API_BASE_URL}/auth/profile`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await fetch('/auth/profile', {
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then(res => res.json());
    
    console.log('API: getProfile called');
    return { success: true };
  },

  /**
   * Update user profile
   * PUT /auth/profile
   */
  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user?: User }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.put(`${API_BASE_URL}/auth/profile`, data, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await fetch('/auth/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(data),
    // }).then(res => res.json());
    
    console.log('API: updateProfile called with:', data);
    return { success: true };
  },

  /**
   * Change password
   * POST /auth/change-password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/auth/change-password`, {
    //   current_password: currentPassword,
    //   new_password: newPassword,
    // }, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: changePassword called');
    return { success: true };
  },

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<{ success: boolean }> => {
    // return await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    
    console.log('API: forgotPassword called with:', email);
    return { success: true };
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean }> => {
    // return await axios.post(`${API_BASE_URL}/auth/reset-password`, {
    //   token,
    //   new_password: newPassword,
    // });
    
    console.log('API: resetPassword called');
    return { success: true };
  },
};
