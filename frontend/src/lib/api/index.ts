/**
 * ProctorX API Client
 * Frontend API modules with Flask backend endpoint placeholders
 * All actual API calls are commented out for Python team to implement
 */

import { authApi } from './auth';
import { testsApi } from './tests';
import { proctoringApi } from './proctoring';
import { summaryApi } from './summary';
import { aiApi } from './ai';

// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API client instance
export const api = {
  auth: authApi,
  tests: testsApi,
  proctoring: proctoringApi,
  summary: summaryApi,
  ai: aiApi,
};

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('bearer_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch wrapper with error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // const url = `${API_BASE_URL}${endpoint}`;
  // const headers = {
  //   'Content-Type': 'application/json',
  //   ...getAuthHeaders(),
  //   ...options.headers,
  // };

  // try {
  //   const response = await fetch(url, {
  //     ...options,
  //     headers,
  //   });

  //   if (!response.ok) {
  //     const error = await response.json().catch(() => ({}));
  //     throw new Error(error.message || `HTTP error! status: ${response.status}`);
  //   }

  //   return await response.json();
  // } catch (error) {
  //   console.error(`API request failed: ${endpoint}`, error);
  //   throw error;
  // }

  // Placeholder return
  return { success: true } as T;
}

export default api;
