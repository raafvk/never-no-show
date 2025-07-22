const { app } = require('@azure/functions');

// Sample landlord data
const landlords = new Map([
  ['abc123', { id: 'abc123', email: 'john.doe@example.com', name: 'John Doe' }],
  ['def456', { id: 'def456', email: 'jane.smith@example.com', name: 'Jane Smith' }],
  ['ghi789', { id: 'ghi789', email: 'demo@landlord.com', name: 'Demo Landlord' }],
]);

app.http('landlords', {
    methods: ['GET'],
    route: 'landlords/{landlordId}',
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const landlordId = request.params.landlordId;
        const landlord = landlords.get(landlordId);
        
        if (landlord) {
            return {
                status: 200,
                jsonBody: {
                    exists: true,
                    landlord: landlord
                }
            };
        } else {
            return {
                status: 200,
                jsonBody: {
                    exists: false,
                    message: 'Landlord not found'
                }
            };
        }
    }
});
