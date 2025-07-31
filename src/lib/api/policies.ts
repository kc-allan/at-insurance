import { Policy, PolicyForm, APIResponse } from '@/lib/types'

// Mock policies database
const mockPolicies: Policy[] = [
  {
    id: 'POL-001',
    farmerId: '1',
    type: 'crop',
    product: 'Maize',
    coverage: '5 acres',
    premium: 2500,
    status: 'active',
    validFrom: '2024-01-01',
    validTo: '2024-12-31'
  },
  {
    id: 'POL-002',
    farmerId: '1',
    type: 'livestock',
    product: 'Dairy Cattle',
    coverage: '3 cows',
    premium: 1800,
    status: 'active',
    validFrom: '2024-02-01',
    validTo: '2025-01-31'
  },
  {
    id: 'POL-003',
    farmerId: '2',
    type: 'crop',
    product: 'Beans',
    coverage: '2 acres',
    premium: 1200,
    status: 'active',
    validFrom: '2024-03-01',
    validTo: '2024-11-30'
  }
]

export const getPolicies = async (farmerId: string): Promise<Policy[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return mockPolicies.filter(policy => policy.farmerId === farmerId)
}

export const getPolicy = async (policyId: string): Promise<Policy | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return mockPolicies.find(policy => policy.id === policyId) || null
}

export const buyPolicy = async (policyData: PolicyForm): Promise<APIResponse<Policy>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Calculate premium based on type and coverage
  let premium = 0
  if (policyData.type === 'crop') {
    premium = policyData.coverage * 500 // KES 500 per acre
  } else {
    premium = policyData.coverage * 600 // KES 600 per animal
  }
  
  // Create new policy
  const newPolicy: Policy = {
    id: `POL-${Date.now()}`,
    farmerId: '1', // Mock current user
    type: policyData.type,
    product: policyData.product,
    coverage: `${policyData.coverage} ${policyData.type === 'crop' ? 'acres' : 'animals'}`,
    premium,
    status: 'active',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
  
  // Add to mock database
  mockPolicies.push(newPolicy)
  
  return { success: true, data: newPolicy }
}

export const renewPolicy = async (policyId: string): Promise<APIResponse<Policy>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const existingPolicy = mockPolicies.find(p => p.id === policyId)
  if (!existingPolicy) {
    return { success: false, message: 'Policy not found' }
  }
  
  // Create renewed policy
  const renewedPolicy: Policy = {
    ...existingPolicy,
    id: `POL-${Date.now()}`,
    status: 'active',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
  
  // Add to mock database
  mockPolicies.push(renewedPolicy)
  
  return { success: true, data: renewedPolicy }
}

export const calculatePremium = async (policyData: Partial<PolicyForm>): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (!policyData.type || !policyData.coverage) return 0
  
  if (policyData.type === 'crop') {
    return policyData.coverage * 500 // KES 500 per acre
  } else {
    return policyData.coverage * 600 // KES 600 per animal
  }
}