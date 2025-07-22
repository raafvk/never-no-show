import { NextRequest, NextResponse } from 'next/server';
import { TenantFormData, SubmissionResponse } from '@/types';
import { validateForm, calculateCredibilityScore, calculateNoShowRisk } from '@/utils/scoring';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const formData: TenantFormData = await request.json();

    // Validate the form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Please correct the form errors',
        errors: validationErrors,
      }, { status: 400 });
    }

    // Validate landlord exists
    const landlord = db.getLandlord(formData.landlordId);
    if (!landlord) {
      return NextResponse.json({
        success: false,
        message: 'Invalid landlord ID',
      }, { status: 400 });
    }

    // Calculate credibility score and no-show risk
    const credibilityScore = calculateCredibilityScore(formData);
    const noShowRisk = calculateNoShowRisk(formData, credibilityScore);

    // Save submission to database
    const submissionId = db.addSubmission(
      formData.landlordId,
      formData,
      credibilityScore,
      noShowRisk
    );

    // In a real app, you would send an email here
    // For now, we'll simulate it by logging
    console.log('Email notification sent to landlord:', {
      landlordEmail: landlord.email,
      landlordName: landlord.name,
      tenantName: formData.fullName,
      tenantEmail: formData.email,
      credibilityScore: credibilityScore.overall,
      riskLevel: credibilityScore.riskLevel,
      noShowRisk: noShowRisk.percentage,
      submissionId,
    });

    const response: SubmissionResponse = {
      success: true,
      message: 'Submission successful',
      credibilityScore,
      noShowRisk,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing submission:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again.',
    }, { status: 500 });
  }
}
