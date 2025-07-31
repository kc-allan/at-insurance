import { Farmer, AuthResponse } from '@/lib/types'
import { apiRequest } from './config'

export const sendOTP = async (phone: string): Promise<{ success: boolean; otp?: string }> => {
  try {
    const response = await apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
    return {
      success: response.success,
      otp: response.otp, // Include OTP from response
    };
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false };
  }
}

export const verifyOTP = async (phone: string, otp: string): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });

    if (response.success && response.token) {
      // Store token for future requests
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }

    return {
      success: response.success,
      user: response.user,
      message: response.message,
    };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, message: error.message || 'OTP verification failed' };
  }
}

export const registerUser = async (userData: Omit<Farmer, 'id' | 'joinDate'>): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.token) {
      // Store token and user data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }

    return {
      success: response.success,
      user: response.user,
      message: response.message,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message || 'Registration failed' };
  }
}

export const getCurrentUser = async (): Promise<Farmer | null> => {
  try {
    // First try to get from localStorage
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // If not in localStorage, fetch from API
    const response = await apiRequest('/auth/me');
    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    // Clear invalid token
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return null;
  }
}

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  window.location.href = '/login';
}