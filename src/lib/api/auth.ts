import { Farmer, AuthResponse } from '@/lib/types'

// Mock user database
const mockUsers: Farmer[] = [
  {
    id: '1',
    name: 'John Mwangi',
    phone: '+254712345678',
    county: 'Nakuru',
    joinDate: '2024-01-15'
  },
  {
    id: '2', 
    name: 'Mary Wanjiku',
    phone: '+254723456789',
    county: 'Kiambu',
    joinDate: '2024-02-10'
  }
]

export const sendOTP = async (phone: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock: Always succeed for valid phone numbers
  const isValidPhone = phone.match(/^\+254[17]\d{8}$/)
  return !!isValidPhone
}

export const verifyOTP = async (phone: string, otp: string): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock: Any 6-digit OTP works
  if (otp.length !== 6) {
    return { success: false, message: 'Invalid OTP' }
  }
  
  // Check if user exists
  const existingUser = mockUsers.find(user => user.phone === phone)
  
  if (existingUser) {
    return { success: true, user: existingUser }
  }
  
  // Return success but no user (new user)
  return { success: true, message: 'New user - proceed to registration' }
}

export const registerUser = async (userData: Omit<Farmer, 'id' | 'joinDate'>): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Create new user
  const newUser: Farmer = {
    ...userData,
    id: Date.now().toString(),
    joinDate: new Date().toISOString().split('T')[0]
  }
  
  // Add to mock database
  mockUsers.push(newUser)
  
  return { success: true, user: newUser }
}

export const getCurrentUser = async (userId: string): Promise<Farmer | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return mockUsers.find(user => user.id === userId) || null
}