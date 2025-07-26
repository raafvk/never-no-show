// Test script for Azure SQL Database connection
// Run with: node test-azuresql.js

const sql = require('mssql');

// Load environment variables from local.settings.json
try {
    const localSettings = require('./local.settings.json');
    Object.assign(process.env, localSettings.Values);
    console.log('✅ Loaded configuration from local.settings.json\n');
} catch (error) {
    console.log('⚠️  Could not load local.settings.json');
    console.log('Make sure you are running this from the api/ directory\n');
}

const config = {
    server: process.env.AZURE_SQL_SERVER || '',
    database: process.env.AZURE_SQL_DATABASE || 'nevernoshow',
    user: process.env.AZURE_SQL_USERNAME || '',
    password: process.env.AZURE_SQL_PASSWORD || '',
    options: {
        encrypt: process.env.AZURE_SQL_ENCRYPT === 'true',
        trustServerCertificate: process.env.AZURE_SQL_TRUST_CERT === 'true'
    }
};

async function testConnection() {
    console.log('🔄 Testing Azure SQL Database connection...\n');
    
    // Check environment variables
    console.log('Configuration:');
    console.log(`- Server: ${config.server || '❌ NOT SET'}`);
    console.log(`- Database: ${config.database || '❌ NOT SET'}`);
    console.log(`- Username: ${config.user || '❌ NOT SET'}`);
    console.log(`- Password: ${config.password ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`- Encrypt: ${config.options.encrypt}`);
    console.log();

    if (!config.server || !config.user || !config.password) {
        console.log('❌ Missing required environment variables. Please check:');
        console.log('   - AZURE_SQL_SERVER');
        console.log('   - AZURE_SQL_USERNAME');
        console.log('   - AZURE_SQL_PASSWORD');
        console.log('\nUpdate api/local.settings.json with your Azure SQL credentials.');
        return;
    }

    try {
        // Test connection
        console.log('🔄 Connecting to Azure SQL Database...');
        const pool = await sql.connect(config);
        console.log('✅ Connection successful!\n');

        // Test query
        console.log('🔄 Testing query execution...');
        const result = await pool.request().query('SELECT 1 as test, GETDATE() as current_datetime');
        console.log('✅ Query successful!');
        console.log('📊 Result:', result.recordset[0]);
        console.log();

        // Check if tables exist
        console.log('🔄 Checking existing tables...');
        const tables = await pool.request().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
        `);
        
        if (tables.recordset.length > 0) {
            console.log('📋 Existing tables:');
            tables.recordset.forEach(table => {
                console.log(`   - ${table.TABLE_NAME}`);
            });
        } else {
            console.log('📋 No tables found. Run the init-database function to create tables.');
        }

        await pool.close();
        console.log('\n🎉 Azure SQL Database is ready to use!');
        console.log('\nNext steps:');
        console.log('1. cd api && npm start');
        console.log('2. curl http://localhost:7071/api/init-database');
        console.log('3. Test the application');

    } catch (error) {
        console.log('\n❌ Connection failed!');
        console.log('Error:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Check your Azure SQL credentials');
        console.log('2. Verify firewall settings allow your IP');
        console.log('3. Ensure server name includes .database.windows.net');
        console.log('4. Check Azure Portal for server status');
    }
}

testConnection().catch(console.error);
