const { app } = require('@azure/functions');

// Validation and scoring functions
function validateForm(formData) {
    const errors = {};
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
        errors.fullName = 'Full name is required (minimum 2 characters)';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Valid email address is required';
    }
    
    if (!formData.phoneNumber || !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Valid phone number is required';
    }
    
    return errors;
}

function calculateCredibilityScore(formData) {
    let score = 50; // Base score
    
    // Positive factors
    if (formData.email && formData.email.includes('.com')) score += 10;
    if (formData.phoneNumber && formData.phoneNumber.length >= 10) score += 10;
    if (formData.fullName && formData.fullName.split(' ').length >= 2) score += 10;
    
    // Negative factors
    if (formData.previousNoShow) score -= 20;
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
}

function determineNoShowRisk(score, formData) {
    if (formData.previousNoShow) return 'high';
    if (score >= 70) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
}

app.http('submissions', {
    methods: ['POST'],
    route: 'submissions',
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const formData = await request.json();
            
            // Validate form data
            const validationErrors = validateForm(formData);
            if (Object.keys(validationErrors).length > 0) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        message: 'Validation errors',
                        errors: validationErrors
                    }
                };
            }
            
            // Calculate credibility score
            const score = calculateCredibilityScore(formData);
            const risk = determineNoShowRisk(score, formData);
            
            const submission = {
                id: Math.random().toString(36).substr(2, 9),
                tenantData: formData,
                credibilityScore: {
                    overall: score,
                    factors: {
                        contactInfo: formData.email && formData.phoneNumber ? 'good' : 'poor',
                        previousHistory: formData.previousNoShow ? 'concerning' : 'clean'
                    }
                },
                noShowRisk: risk,
                submittedAt: new Date().toISOString()
            };
            
            // Log for landlord notification (in real app, send email)
            console.log(`New tenant submission for landlord ${formData.landlordId}:`, submission);
            
            return {
                status: 200,
                jsonBody: {
                    success: true,
                    message: 'Submission received successfully',
                    submissionId: submission.id
                }
            };
            
        } catch (error) {
            console.error('Error processing submission:', error);
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    message: 'Internal server error'
                }
            };
        }
    }
});
