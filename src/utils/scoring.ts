import { TenantFormData, CredibilityScore, NoShowRisk, FormErrors } from '@/types';

// Simple email regex validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number regex (supports various formats)
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

export function validateForm(data: Partial<TenantFormData>): FormErrors {
  const errors: FormErrors = {};

  // Required field validations
  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else {
    const cleanPhone = data.phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!PHONE_REGEX.test(cleanPhone)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
  }

  return errors;
}

export function calculateCredibilityScore(data: TenantFormData): CredibilityScore {
  // Simple scoring algorithm for PoC
  let contactInfo = 85; // Base score for having complete contact info
  let history = 80; // Base score
  let communication = 75; // Base score

  // Adjust based on previous no-show history
  if (data.previousNoShow) {
    history -= 30;
    contactInfo -= 10;
  }

  // Boost score if additional comments are provided (shows engagement)
  if (data.additionalComments && data.additionalComments.trim().length > 10) {
    communication += 15;
  }

  // Email domain quality check (simple heuristic)
  const emailDomain = data.email.split('@')[1];
  const premiumDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
  if (premiumDomains.includes(emailDomain)) {
    contactInfo += 5;
  }

  // Ensure scores are within bounds
  contactInfo = Math.max(0, Math.min(100, contactInfo));
  history = Math.max(0, Math.min(100, history));
  communication = Math.max(0, Math.min(100, communication));

  const overall = Math.round((contactInfo + history + communication) / 3);

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (overall < 50) riskLevel = 'high';
  else if (overall < 75) riskLevel = 'medium';

  return {
    overall,
    breakdown: {
      contactInfo,
      history,
      communication,
    },
    riskLevel,
  };
}

export function calculateNoShowRisk(data: TenantFormData, credibilityScore: CredibilityScore): NoShowRisk {
  let riskPercentage = 10; // Base 10% risk
  const factors: string[] = [];

  // Increase risk based on credibility score
  if (credibilityScore.overall < 50) {
    riskPercentage += 40;
    factors.push('Low overall credibility score');
  } else if (credibilityScore.overall < 75) {
    riskPercentage += 20;
    factors.push('Moderate credibility concerns');
  }

  // Previous no-show significantly increases risk
  if (data.previousNoShow) {
    riskPercentage += 35;
    factors.push('History of previous no-shows');
  }

  // Lack of additional information slightly increases risk
  if (!data.additionalComments || data.additionalComments.trim().length < 5) {
    riskPercentage += 10;
    factors.push('Limited additional information provided');
  }

  // Ensure risk is within bounds
  riskPercentage = Math.min(90, riskPercentage);

  let recommendation: string;
  if (riskPercentage < 20) {
    recommendation = 'Low risk tenant - proceed with confidence';
  } else if (riskPercentage < 50) {
    recommendation = 'Moderate risk - consider additional screening or deposit';
  } else {
    recommendation = 'High risk - recommend thorough background check and higher deposit';
  }

  return {
    percentage: riskPercentage,
    factors,
    recommendation,
  };
}

export function generateLandlordId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
