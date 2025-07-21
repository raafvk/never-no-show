// TypeScript interfaces for the tenant credibility app

export interface TenantFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  previousNoShow: boolean;
  additionalComments?: string;
  landlordId: string;
}

export interface CredibilityScore {
  overall: number; // 0-100
  breakdown: {
    contactInfo: number;
    history: number;
    communication: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
}

export interface NoShowRisk {
  percentage: number; // 0-100
  factors: string[];
  recommendation: string;
}

export interface LandlordData {
  id: string;
  email: string;
  name: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  credibilityScore?: CredibilityScore;
  noShowRisk?: NoShowRisk;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  general?: string;
}
