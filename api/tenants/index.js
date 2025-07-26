const database = require('../shared/database');

module.exports = async function (context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    try {
        const email = req.params.email;
        
        if (!email) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    success: false,
                    message: 'Email parameter is required'
                }
            };
            return;
        }

        // Get tenant credibility information
        const tenant = await database.getTenant(email);
        
        if (!tenant) {
            context.res = {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    success: false,
                    message: 'Tenant not found',
                    hasProfile: false
                }
            };
            return;
        }

        // Return tenant credibility summary
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: true,
                hasProfile: true,
                tenant: {
                    name: tenant.name,
                    email: tenant.email,
                    currentScore: tenant.currentScore,
                    averageScore: tenant.averageScore,
                    submissionCount: tenant.submissionCount,
                    lastSubmission: tenant.lastSubmission,
                    memberSince: tenant.createdAt
                }
            }
        };

    } catch (error) {
        context.log.error('Error retrieving tenant credibility:', error);
        
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: false,
                message: 'Internal server error'
            }
        };
    }
};
