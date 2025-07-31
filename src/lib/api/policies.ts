import { Policy, PolicyForm, APIResponse } from '@/lib/types'
import { apiRequest } from './config'

export const getPolicies = async (): Promise<Policy[]> => {
  try {
    const response = await apiRequest('/policies');
    return response;
  } catch (error) {
    console.error('Get policies error:', error);
    return [];
  }
}

export const getPolicy = async (policyId: string): Promise<Policy | null> => {
  try {
    const response = await apiRequest(`/policies/${policyId}`);
    return response;
  } catch (error) {
    console.error('Get policy error:', error);
    return null;
  }
}

export const buyPolicy = async (policyData: PolicyForm): Promise<APIResponse<Policy>> => {
  try {
    const response = await apiRequest('/policies', {
      method: 'POST',
      body: JSON.stringify(policyData),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Buy policy error:', error);
    return { success: false, message: error.message || 'Failed to create policy' };
  }
}

export const renewPolicy = async (policyId: string): Promise<APIResponse<Policy>> => {
  try {
    const response = await apiRequest(`/policies/${policyId}/renew`, {
      method: 'POST',
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Renew policy error:', error);
    return { success: false, message: error.message || 'Failed to renew policy' };
  }
}

export const calculatePremium = async (policyData: { type: string; coverage: number }): Promise<number> => {
  try {
    const response = await apiRequest('/policies/calculate-premium', {
      method: 'POST',
      body: JSON.stringify(policyData),
    });
    return response.premium;
  } catch (error) {
    console.error('Calculate premium error:', error);
    return 0;
  }
}