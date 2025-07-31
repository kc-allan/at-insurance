export interface Farmer {
  id: string
  name: string
  phone: string
  county: string
  idDocument?: string
  joinDate: string
}

export interface Policy {
  id: string
  farmerId: string
  type: 'crop' | 'livestock'
  product: string
  coverage: number | string
  premium: number
  status: 'active' | 'expired' | 'pending'
  validFrom: string
  validTo: string
}

export interface Claim {
  id: string
  policyId: string
  farmerId: string
  reason: 'drought' | 'livestock_death' | 'flood' | 'pest' | 'disease' | 'other'
  description: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  dateSubmitted: string
  images?: string[]
}

export interface PolicyForm {
  type: 'crop' | 'livestock'
  product: string
  coverage: number
  location: string
}

export interface ClaimForm {
  policyId: string
  reason: string
  description: string
  images?: File[]
}

export interface AuthResponse {
  success: boolean
  user?: Farmer
  message?: string
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  message?: string
}