import { Claim, ClaimForm, APIResponse } from '@/lib/types'

// Mock claims database
const mockClaims: Claim[] = [
  {
    id: 'CLM-001',
    policyId: 'POL-001',
    farmerId: '1',
    reason: 'drought',
    description: 'Severe drought affected maize crop, estimated 80% loss',
    amount: 2000,
    status: 'pending',
    dateSubmitted: '2024-07-15',
    images: []
  },
  {
    id: 'CLM-002',
    policyId: 'POL-002',
    farmerId: '1',
    reason: 'livestock_death',
    description: 'One dairy cow died due to illness',
    amount: 600,
    status: 'approved',
    dateSubmitted: '2024-06-20',
    images: []
  }
]

export const getClaims = async (farmerId: string): Promise<Claim[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return mockClaims.filter(claim => claim.farmerId === farmerId)
}

export const getClaim = async (claimId: string): Promise<Claim | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return mockClaims.find(claim => claim.id === claimId) || null
}

export const submitClaim = async (claimData: ClaimForm): Promise<APIResponse<Claim>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Create new claim
  const newClaim: Claim = {
    id: `CLM-${Date.now()}`,
    policyId: claimData.policyId,
    farmerId: '1', // Mock current user
    reason: claimData.reason as any,
    description: claimData.description,
    amount: 0, // Will be calculated by insurance company
    status: 'pending',
    dateSubmitted: new Date().toISOString().split('T')[0],
    images: [] // In real app, would handle file uploads
  }
  
  // Add to mock database
  mockClaims.push(newClaim)
  
  return { 
    success: true, 
    data: newClaim,
    message: 'Claim submitted successfully. We will contact you shortly.' 
  }
}

export const getClaimsByPolicy = async (policyId: string): Promise<Claim[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return mockClaims.filter(claim => claim.policyId === policyId)
}