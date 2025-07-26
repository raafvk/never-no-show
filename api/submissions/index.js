const database = require('../shared/database');

// Validation and scoring functions
function validateForm(formData) {
    const errors = {};
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
        errors.fullName = 'Full name is required (minimum 2 characters)';
    }
    
    if (!formData.email || !formData.email.includes('@')) {
        errors.email = 'Valid email address is required';
    }
    
    // More flexible phone validation - accept 7+ digits (covers most international formats)
    const phoneDigits = formData.phoneNumber ? formData.phoneNumber.replace(/\D/g, '') : '';
    if (!phoneDigits || phoneDigits.length < 7) {
        errors.phoneNumber = 'Valid phone number is required (minimum 7 digits)';
    }
    
    if (!formData.landlordId) {
        errors.landlordId = 'Landlord ID is required';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
}

function calculateCredibilityScore(formData) {
    let score = 0;
    let maxScore = 0;
    const breakdown = {};
    
    // Employment stability (25 points)
    maxScore += 25;
    if (formData.employmentStatus === 'employed') {
        score += 25;
        breakdown.employment = { score: 25, max: 25, status: 'Excellent' };
    } else if (formData.employmentStatus === 'self-employed') {
        score += 20;
        breakdown.employment = { score: 20, max: 25, status: 'Good' };
    } else if (formData.employmentStatus === 'student') {
        score += 15;
        breakdown.employment = { score: 15, max: 25, status: 'Fair' };
    } else {
        breakdown.employment = { score: 0, max: 25, status: 'Poor' };
    }
    
    // Income level (20 points)
    maxScore += 20;
    const income = parseInt(formData.monthlyIncome);
    if (income >= 5000) {
        score += 20;
        breakdown.income = { score: 20, max: 20, status: 'Excellent' };
    } else if (income >= 3000) {
        score += 15;
        breakdown.income = { score: 15, max: 20, status: 'Good' };
    } else if (income >= 2000) {
        score += 10;
        breakdown.income = { score: 10, max: 20, status: 'Fair' };
    } else {
        score += 5;
        breakdown.income = { score: 5, max: 20, status: 'Poor' };
    }
    
    // Credit score (20 points)
    maxScore += 20;
    if (formData.creditScore === 'excellent') {
        score += 20;
        breakdown.credit = { score: 20, max: 20, status: 'Excellent' };
    } else if (formData.creditScore === 'good') {
        score += 15;
        breakdown.credit = { score: 15, max: 20, status: 'Good' };
    } else if (formData.creditScore === 'fair') {
        score += 10;
        breakdown.credit = { score: 10, max: 20, status: 'Fair' };
    } else {
        score += 5;
        breakdown.credit = { score: 5, max: 20, status: 'Poor' };
    }
    
    // Eviction history (15 points)
    maxScore += 15;
    if (formData.previousEvictions === 'no') {
        score += 15;
        breakdown.evictions = { score: 15, max: 15, status: 'Excellent' };
    } else if (formData.previousEvictions === 'more-than-3-years') {
        score += 10;
        breakdown.evictions = { score: 10, max: 15, status: 'Good' };
    } else {
        breakdown.evictions = { score: 0, max: 15, status: 'Poor' };
    }
    
    // Rental history (10 points)
    maxScore += 10;
    if (formData.rentalHistory && formData.rentalHistory !== 'no-history') {
        const years = parseInt(formData.rentalHistory);
        if (years >= 3) {
            score += 10;
            breakdown.rentalHistory = { score: 10, max: 10, status: 'Excellent' };
        } else if (years >= 1) {
            score += 7;
            breakdown.rentalHistory = { score: 7, max: 10, status: 'Good' };
        } else {
            score += 5;
            breakdown.rentalHistory = { score: 5, max: 10, status: 'Fair' };
        }
    } else {
        breakdown.rentalHistory = { score: 0, max: 10, status: 'No History' };
    }
    
    // Additional factors (10 points)
    maxScore += 10;
    let additionalScore = 0;
    
    if (formData.emergencyContact) additionalScore += 3;
    if (formData.moveInDate) additionalScore += 2;
    if (formData.reasonForMoving && formData.reasonForMoving !== 'other') additionalScore += 3;
    if (formData.hasPets === 'no') additionalScore += 2;
    
    score += additionalScore;
    breakdown.additional = { score: additionalScore, max: 10, status: additionalScore >= 7 ? 'Good' : 'Fair' };
    
    const percentage = Math.round((score / maxScore) * 100);
    
    return {
        total: score,
        maxPossible: maxScore,
        percentage: percentage,
        grade: getGrade(percentage),
        breakdown: breakdown
    };
}

function getGrade(percentage) {
    if (percentage >= 85) return 'A';
    if (percentage >= 75) return 'B';
    if (percentage >= 65) return 'C';
    if (percentage >= 55) return 'D';
    return 'F';
}

function assessNoShowRisk(formData, credibilityScore) {
    let riskScore = 0;
    const factors = [];
    
    // Low credibility increases risk
    if (credibilityScore.percentage < 60) {
        riskScore += 30;
        factors.push('Low overall credibility score');
    } else if (credibilityScore.percentage < 75) {
        riskScore += 15;
        factors.push('Moderate credibility concerns');
    }
    
    // Employment status
    if (formData.employmentStatus === 'unemployed') {
        riskScore += 25;
        factors.push('Unemployment increases no-show risk');
    } else if (formData.employmentStatus === 'student') {
        riskScore += 10;
        factors.push('Student status may affect availability');
    }
    
    // Income concerns
    const income = parseInt(formData.monthlyIncome);
    if (income < 2000) {
        riskScore += 20;
        factors.push('Low income may indicate financial instability');
    }
    
    // Credit and eviction history
    if (formData.creditScore === 'poor') {
        riskScore += 15;
        factors.push('Poor credit history');
    }
    
    if (formData.previousEvictions === 'yes') {
        riskScore += 25;
        factors.push('Previous evictions indicate higher risk');
    }
    
    // Urgency might indicate desperation
    if (formData.reasonForMoving === 'eviction' || formData.reasonForMoving === 'emergency') {
        riskScore += 15;
        factors.push('Urgent moving situation');
    }
    
    // Lack of emergency contact
    if (!formData.emergencyContact) {
        riskScore += 10;
        factors.push('No emergency contact provided');
    }
    
    // Determine risk level
    let riskLevel, recommendation;
    if (riskScore <= 20) {
        riskLevel = 'Low';
        recommendation = 'Proceed with standard screening process';
    } else if (riskScore <= 40) {
        riskLevel = 'Moderate';
        recommendation = 'Consider additional verification or references';
    } else if (riskScore <= 60) {
        riskLevel = 'High';
        recommendation = 'Require additional security deposit or guarantor';
    } else {
        riskLevel = 'Very High';
        recommendation = 'Consider alternative arrangements or decline application';
    }
    
    return {
        score: Math.min(riskScore, 100),
        level: riskLevel,
        factors: factors,
        recommendation: recommendation
    };
}

module.exports = async function (context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    try {
        context.log('Processing tenant form submission...');
        context.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const formData = req.body;
        
        // Validate form data
        const validationErrors = validateForm(formData);
        context.log('Validation errors:', validationErrors);
        if (validationErrors) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: {
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors
                }
            };
            return;
        }

        // Verify landlord exists
        const landlord = await database.validateLandlord(formData.landlordId);
        if (!landlord) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: {
                    success: false,
                    message: 'Invalid landlord ID'
                }
            };
            return;
        }

        // Calculate credibility score and risk assessment
        const score = calculateCredibilityScore(formData);
        const risk = assessNoShowRisk(formData, score);

        // Handle tenant record (create or update with credibility scoring)
        try {
            const existingTenant = await database.getTenant(formData.email);
            if (existingTenant) {
                // Update existing tenant with new score
                const newSubmissionCount = (existingTenant.submissionCount || 0) + 1;
                const currentAverage = existingTenant.averageScore || 0;
                const newAverage = ((currentAverage * (newSubmissionCount - 1)) + score.percentage) / newSubmissionCount;
                
                await database.updateTenant(formData.email, {
                    name: formData.fullName,
                    lastSubmission: new Date().toISOString(),
                    currentScore: score.percentage,
                    submissionCount: newSubmissionCount,
                    averageScore: Math.round(newAverage * 100) / 100
                });
            } else {
                // Create new tenant with initial score
                await database.createTenant({
                    email: formData.email,
                    name: formData.fullName,
                    createdAt: new Date().toISOString(),
                    lastSubmission: new Date().toISOString(),
                    currentScore: score.percentage,
                    submissionCount: 1,
                    averageScore: score.percentage
                });
            }
        } catch (tenantError) {
            context.log.warn('Error handling tenant record:', tenantError);
            // Continue with submission even if tenant handling fails
        }

        // Create submission record
        const submission = {
            id: `${formData.landlordId}_${Date.now()}`,
            landlordId: formData.landlordId,
            tenantEmail: formData.email,
            tenantName: formData.fullName,
            formData: formData,
            credibilityScore: score,
            noShowRisk: risk,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Save submission to database
        const savedSubmission = await database.createSubmission(submission);

        // Return success response with analysis
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: {
                success: true,
                message: 'Form submitted successfully',
                submissionId: savedSubmission.id,
                credibilityScore: score,
                noShowRisk: risk,
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        context.log.error('Error processing submission:', error);
        
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: {
                success: false,
                message: 'Internal server error',
                error: error.message
            }
        };
    }
};
