// Sample landlord data
const landlords = new Map([
  ['abc123', { id: 'abc123', email: 'john.doe@example.com', name: 'John Doe' }],
  ['def456', { id: 'def456', email: 'jane.smith@example.com', name: 'Jane Smith' }],
  ['ghi789', { id: 'ghi789', email: 'demo@landlord.com', name: 'Demo Landlord' }],
]);

module.exports = async function (context, req) {
    const landlordId = req.params.landlordId || context.bindingData.landlordId;
    const landlord = landlords.get(landlordId);
    
    if (landlord) {
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: {
                exists: true,
                landlord: landlord
            }
        };
    } else {
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: {
                exists: false,
                message: 'Landlord not found'
            }
        };
    }
};
