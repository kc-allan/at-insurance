import { Claim, ClaimForm, APIResponse } from '@/lib/types'
import { API_BASE_URL, getAuthHeaders } from './config'

export const getClaims = async (): Promise<Claim[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/claims`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch claims');
    }
    
    return response.json();
  } catch (error) {
    console.error('Get claims error:', error);
    return [];
  }
}

export const getClaim = async (claimId: string): Promise<Claim | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/claims/${claimId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch claim');
    }
    
    return response.json();
  } catch (error) {
    console.error('Get claim error:', error);
    return null;
  }
}

export const submitClaim = async (claimData: ClaimForm): Promise<APIResponse<Claim>> => {
  try {
    const formData = new FormData();
    formData.append('policyId', claimData.policyId);
    formData.append('reason', claimData.reason);
    formData.append('description', claimData.description);
    
    // Add images if provided
    if (claimData.images) {
      claimData.images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/claims`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit claim');
    }

    return response.json();
  } catch (error) {
    console.error('Submit claim error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to submit claim' 
    };
  }
}

export const getClaimsByPolicy = async (policyId: string): Promise<Claim[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/claims/by-policy/${policyId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch claims');
    }
    
    return response.json();
  } catch (error) {
    console.error('Get claims by policy error:', error);
    return [];
  }
}