const { initializeDatabase, seedData } = require('../shared/database');

module.exports = async function (context, req) {
    try {
        context.log('Initializing database and tables...');
        
        // Initialize database and tables
        await initializeDatabase();
        
        // Seed initial data
        await seedData();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: true,
                message: 'Database initialized and seeded successfully',
                timestamp: new Date().toISOString()
            }
        };
        
    } catch (error) {
        context.log.error('Error initializing database:', error);
        
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: false,
                message: 'Failed to initialize database',
                error: error.message
            }
        };
    }
};
