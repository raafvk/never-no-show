// Database abstraction layer - switches between local JSON and Azure SQL
// This file maintains the same interface for all database operations

// Check if we should use local database instead
if (process.env.USE_LOCAL_DB === 'true') {
    console.log('Using local JSON database for development');
    module.exports = require('./localdb');
} else {
    console.log('Using Azure SQL Database for production');
    module.exports = require('./azuresql');
}
