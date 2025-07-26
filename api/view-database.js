const sql = require('mssql');

// Load environment variables
try {
    const localSettings = require('./local.settings.json');
    Object.assign(process.env, localSettings.Values);
} catch (error) {
    console.error('Could not load local settings');
    process.exit(1);
}

// Azure SQL Database configuration
const config = {
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    user: process.env.AZURE_SQL_USERNAME,
    password: process.env.AZURE_SQL_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function viewDatabaseData() {
    let pool;
    try {
        console.log('Connecting to Azure SQL Database...');
        pool = await new sql.ConnectionPool(config).connect();
        
        console.log('\n=== LANDLORDS TABLE ===');
        const landlords = await pool.request().query('SELECT * FROM Landlords');
        console.table(landlords.recordset);
        
        console.log('\n=== TENANTS TABLE ===');
        const tenants = await pool.request().query('SELECT * FROM Tenants');
        console.table(tenants.recordset);
        
        console.log('\n=== SUBMISSIONS TABLE ===');
        const submissions = await pool.request().query(`
            SELECT 
                id,
                landlordId,
                tenantEmail,
                score,
                submittedAt,
                LEFT(formData, 100) + '...' as formDataPreview
            FROM Submissions 
            ORDER BY submittedAt DESC
        `);
        console.table(submissions.recordset);
        
        console.log('\n=== SUMMARY ===');
        const summary = await pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM Landlords) as TotalLandlords,
                (SELECT COUNT(*) FROM Tenants) as TotalTenants,
                (SELECT COUNT(*) FROM Submissions) as TotalSubmissions
        `);
        console.table(summary.recordset);
        
    } catch (error) {
        console.error('Error viewing database:', error);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

viewDatabaseData();
