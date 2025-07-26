const database = require('../shared/database');

module.exports = async function (context, req) {
    try {
        const landlordId = req.params.landlordId || context.bindingData.landlordId;
        
        if (!landlordId) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: {
                    exists: false,
                    message: 'Landlord ID is required'
                }
            };
            return;
        }

        // Validate landlord exists in database
        const landlord = await database.validateLandlord(landlordId);
        
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
                    landlord: {
                        id: landlord.id,
                        name: landlord.name,
                        email: landlord.email
                    }
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
    } catch (error) {
        console.error('Error in landlords function:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: {
                exists: false,
                message: 'Internal server error'
            }
        };
    }
};
