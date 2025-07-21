import { LandlordData, TenantFormData, CredibilityScore, NoShowRisk } from '@/types';

// In-memory database simulation for PoC
// In a real app, this would be replaced with a proper database

interface TenantSubmission {
  id: string;
  tenantData: TenantFormData;
  credibilityScore: CredibilityScore;
  noShowRisk: NoShowRisk;
  submittedAt: Date;
}

class InMemoryDB {
  private landlords: Map<string, LandlordData> = new Map();
  private submissions: Map<string, TenantSubmission[]> = new Map();

  constructor() {
    // Seed with some sample landlords for demo
    this.seedData();
  }

  private seedData() {
    const sampleLandlords: LandlordData[] = [
      { id: 'abc123', email: 'john.doe@example.com', name: 'John Doe' },
      { id: 'def456', email: 'jane.smith@example.com', name: 'Jane Smith' },
      { id: 'ghi789', email: 'demo@landlord.com', name: 'Demo Landlord' },
    ];

    sampleLandlords.forEach(landlord => {
      this.landlords.set(landlord.id, landlord);
      this.submissions.set(landlord.id, []);
    });
  }

  // Landlord operations
  getLandlord(landlordId: string): LandlordData | null {
    return this.landlords.get(landlordId) || null;
  }

  addLandlord(landlord: LandlordData): void {
    this.landlords.set(landlord.id, landlord);
    if (!this.submissions.has(landlord.id)) {
      this.submissions.set(landlord.id, []);
    }
  }

  // Submission operations
  addSubmission(
    landlordId: string,
    tenantData: TenantFormData,
    credibilityScore: CredibilityScore,
    noShowRisk: NoShowRisk
  ): string {
    const submission: TenantSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      tenantData,
      credibilityScore,
      noShowRisk,
      submittedAt: new Date(),
    };

    const landlordSubmissions = this.submissions.get(landlordId) || [];
    landlordSubmissions.push(submission);
    this.submissions.set(landlordId, landlordSubmissions);

    return submission.id;
  }

  getSubmissions(landlordId: string): TenantSubmission[] {
    return this.submissions.get(landlordId) || [];
  }

  getSubmission(landlordId: string, submissionId: string): TenantSubmission | null {
    const submissions = this.getSubmissions(landlordId);
    return submissions.find(sub => sub.id === submissionId) || null;
  }

  // Get tenant history for credibility calculation
  getTenantHistory(email: string): TenantSubmission[] {
    const allSubmissions: TenantSubmission[] = [];
    
    this.submissions.forEach(submissions => {
      const tenantSubmissions = submissions.filter(
        sub => sub.tenantData.email.toLowerCase() === email.toLowerCase()
      );
      allSubmissions.push(...tenantSubmissions);
    });

    return allSubmissions;
  }
}

// Singleton instance
export const db = new InMemoryDB();
