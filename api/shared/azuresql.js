const sql = require('mssql');

console.log('Using Azure SQL Database');

// Load environment variables from local.settings.json if running locally
try {
    if (process.env.NODE_ENV !== 'production') {
        const localSettings = require('../local.settings.json');
        Object.assign(process.env, localSettings.Values);
        console.log('Loaded environment variables from local.settings.json');
    } else {
        console.log('Running in production - using Azure Static Web Apps environment variables');
    }
} catch (error) {
    // Ignore if local.settings.json doesn't exist (production environment)
    console.log('No local.settings.json found - using environment variables');
}

// Azure SQL Database configuration
const config = {
    server: process.env.AZURE_SQL_SERVER || 'your-server.database.windows.net',
    database: process.env.AZURE_SQL_DATABASE || 'NeverNoShowDB',
    user: process.env.AZURE_SQL_USERNAME || 'your-username',
    password: process.env.AZURE_SQL_PASSWORD || 'your-password',
    options: {
        encrypt: true, // Required for Azure SQL
        trustServerCertificate: false,
        connectTimeout: 60000, // 60 seconds
        requestTimeout: 60000, // 60 seconds
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 60000,
        createTimeoutMillis: 60000,
        destroyTimeoutMillis: 5000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200
    }
};

console.log(`Azure SQL Config: ${config.server}/${config.database}`);

// Connection pool
let poolPromise;

async function getPool() {
    if (!poolPromise) {
        console.log('Creating new Azure SQL connection pool...');
        poolPromise = new sql.ConnectionPool(config).connect()
            .then(pool => {
                console.log('✅ Azure SQL connection pool created successfully');
                return pool;
            })
            .catch(err => {
                console.error('❌ Failed to create Azure SQL connection pool:', err);
                poolPromise = null; // Reset so we can retry
                throw err;
            });
    }
    return poolPromise;
}

// Database operations helper - same interface as Cosmos DB and Firebase
class AzureSQLService {
    
    // Initialize database and tables
    async initializeDatabase() {
        try {
            const pool = await getPool();
            
            // Create tables if they don't exist
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Landlords')
                BEGIN
                    CREATE TABLE Landlords (
                        id NVARCHAR(50) PRIMARY KEY,
                        email NVARCHAR(255) NOT NULL,
                        name NVARCHAR(255) NOT NULL,
                        createdAt DATETIME2 DEFAULT GETUTCDATE(),
                        activeLinks INT DEFAULT 0,
                        totalSubmissions INT DEFAULT 0,
                        verificationStatus NVARCHAR(50) DEFAULT 'pending'
                    )
                END
            `);

            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tenants')
                BEGIN
                    CREATE TABLE Tenants (
                        email NVARCHAR(255) PRIMARY KEY,
                        name NVARCHAR(255),
                        createdAt DATETIME2 DEFAULT GETUTCDATE(),
                        lastSubmission DATETIME2,
                        currentScore DECIMAL(5,2) DEFAULT NULL,
                        submissionCount INT DEFAULT 0,
                        averageScore DECIMAL(5,2) DEFAULT NULL
                    )
                END
            `);

            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Submissions')
                BEGIN
                    CREATE TABLE Submissions (
                        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                        landlordId NVARCHAR(50) NOT NULL,
                        tenantEmail NVARCHAR(255),
                        formData NVARCHAR(MAX), -- JSON string
                        score DECIMAL(3,1),
                        submittedAt DATETIME2 DEFAULT GETUTCDATE(),
                        FOREIGN KEY (landlordId) REFERENCES Landlords(id)
                    )
                END
            `);

            console.log('Azure SQL Database tables initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    }

    // Landlord operations
    async getLandlord(landlordId) {
        try {
            const pool = await getPool();
            const result = await pool.request()
                .input('id', sql.NVarChar(50), landlordId)
                .query('SELECT * FROM Landlords WHERE id = @id');
            
            return result.recordset.length > 0 ? result.recordset[0] : null;
        } catch (error) {
            throw error;
        }
    }

    async createLandlord(landlordData) {
        try {
            const pool = await getPool();
            await pool.request()
                .input('id', sql.NVarChar(50), landlordData.id)
                .input('email', sql.NVarChar(255), landlordData.email)
                .input('name', sql.NVarChar(255), landlordData.name)
                .input('createdAt', sql.DateTime2, new Date(landlordData.createdAt))
                .input('activeLinks', sql.Int, landlordData.activeLinks || 0)
                .input('totalSubmissions', sql.Int, landlordData.totalSubmissions || 0)
                .input('verificationStatus', sql.NVarChar(50), landlordData.verificationStatus || 'pending')
                .query(`
                    INSERT INTO Landlords (id, email, name, createdAt, activeLinks, totalSubmissions, verificationStatus)
                    VALUES (@id, @email, @name, @createdAt, @activeLinks, @totalSubmissions, @verificationStatus)
                `);
            
            return landlordData;
        } catch (error) {
            throw error;
        }
    }

    async updateLandlord(landlordId, landlordData) {
        try {
            const pool = await getPool();
            await pool.request()
                .input('id', sql.NVarChar(50), landlordId)
                .input('email', sql.NVarChar(255), landlordData.email)
                .input('name', sql.NVarChar(255), landlordData.name)
                .input('activeLinks', sql.Int, landlordData.activeLinks)
                .input('totalSubmissions', sql.Int, landlordData.totalSubmissions)
                .input('verificationStatus', sql.NVarChar(50), landlordData.verificationStatus)
                .query(`
                    UPDATE Landlords 
                    SET email = @email, name = @name, activeLinks = @activeLinks, 
                        totalSubmissions = @totalSubmissions, verificationStatus = @verificationStatus
                    WHERE id = @id
                `);
            
            return { id: landlordId, ...landlordData };
        } catch (error) {
            throw error;
        }
    }

    // Tenant operations
    async getTenant(email) {
        try {
            const pool = await getPool();
            const result = await pool.request()
                .input('email', sql.NVarChar(255), email)
                .query('SELECT * FROM Tenants WHERE email = @email');
            
            return result.recordset.length > 0 ? result.recordset[0] : null;
        } catch (error) {
            throw error;
        }
    }

    async createTenant(tenantData) {
        try {
            const pool = await getPool();
            await pool.request()
                .input('email', sql.NVarChar(255), tenantData.email)
                .input('name', sql.NVarChar(255), tenantData.name)
                .input('createdAt', sql.DateTime2, new Date(tenantData.createdAt || new Date()))
                .input('lastSubmission', sql.DateTime2, tenantData.lastSubmission ? new Date(tenantData.lastSubmission) : null)
                .query(`
                    INSERT INTO Tenants (email, name, createdAt, lastSubmission)
                    VALUES (@email, @name, @createdAt, @lastSubmission)
                `);
            
            return tenantData;
        } catch (error) {
            throw error;
        }
    }

    async updateTenant(email, tenantData) {
        try {
            const pool = await getPool();
            await pool.request()
                .input('email', sql.NVarChar(255), email)
                .input('name', sql.NVarChar(255), tenantData.name)
                .input('lastSubmission', sql.DateTime2, tenantData.lastSubmission ? new Date(tenantData.lastSubmission) : null)
                .query(`
                    UPDATE Tenants 
                    SET name = @name, lastSubmission = @lastSubmission
                    WHERE email = @email
                `);
            
            return { email: email, ...tenantData };
        } catch (error) {
            throw error;
        }
    }

    async getTenantHistory(email) {
        try {
            const pool = await getPool();
            const result = await pool.request()
                .input('email', sql.NVarChar(255), email)
                .query(`
                    SELECT * FROM Submissions 
                    WHERE tenantEmail = @email 
                    ORDER BY submittedAt DESC
                `);
            
            return result.recordset.map(row => ({
                ...row,
                formData: row.formData ? JSON.parse(row.formData) : null
            }));
        } catch (error) {
            throw error;
        }
    }

    // Submission operations
    async createSubmission(submissionData) {
        try {
            const pool = await getPool();
            const result = await pool.request()
                .input('landlordId', sql.NVarChar(50), submissionData.landlordId)
                .input('tenantEmail', sql.NVarChar(255), submissionData.tenantEmail)
                .input('formData', sql.NVarChar(sql.MAX), JSON.stringify(submissionData.formData))
                .input('score', sql.Decimal(3, 1), submissionData.score)
                .input('submittedAt', sql.DateTime2, new Date(submissionData.submittedAt))
                .query(`
                    INSERT INTO Submissions (landlordId, tenantEmail, formData, score, submittedAt)
                    OUTPUT INSERTED.id
                    VALUES (@landlordId, @tenantEmail, @formData, @score, @submittedAt)
                `);
            
            const newId = result.recordset[0].id;
            return { id: newId, ...submissionData };
        } catch (error) {
            throw error;
        }
    }

    async getSubmission(submissionId, landlordId) {
        try {
            const pool = await getPool();
            const result = await pool.request()
                .input('id', sql.UniqueIdentifier, submissionId)
                .input('landlordId', sql.NVarChar(50), landlordId)
                .query('SELECT * FROM Submissions WHERE id = @id AND landlordId = @landlordId');
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            const row = result.recordset[0];
            return {
                ...row,
                formData: row.formData ? JSON.parse(row.formData) : null
            };
        } catch (error) {
            throw error;
        }
    }

    async getLandlordSubmissions(landlordId) {
        try {
            const pool = await getPool();
            const result = await pool.request()
                .input('landlordId', sql.NVarChar(50), landlordId)
                .query(`
                    SELECT * FROM Submissions 
                    WHERE landlordId = @landlordId 
                    ORDER BY submittedAt DESC
                `);
            
            return result.recordset.map(row => ({
                ...row,
                formData: row.formData ? JSON.parse(row.formData) : null
            }));
        } catch (error) {
            throw error;
        }
    }

    async updateSubmission(submissionId, landlordId, submissionData) {
        try {
            const pool = await getPool();
            await pool.request()
                .input('id', sql.UniqueIdentifier, submissionId)
                .input('landlordId', sql.NVarChar(50), landlordId)
                .input('formData', sql.NVarChar(sql.MAX), JSON.stringify(submissionData.formData))
                .input('score', sql.Decimal(3, 1), submissionData.score)
                .query(`
                    UPDATE Submissions 
                    SET formData = @formData, score = @score
                    WHERE id = @id AND landlordId = @landlordId
                `);
            
            return { id: submissionId, ...submissionData };
        } catch (error) {
            throw error;
        }
    }

    // Seed initial data
    async seedData() {
        try {
            // Check if landlords already exist
            const existingLandlord = await this.getLandlord('abc123');
            if (existingLandlord) {
                console.log('Data already seeded');
                return;
            }

            // Create sample landlords
            const sampleLandlords = [
                { 
                    id: 'abc123', 
                    email: 'john.doe@example.com', 
                    name: 'John Doe',
                    createdAt: new Date().toISOString(),
                    activeLinks: 1,
                    totalSubmissions: 0,
                    verificationStatus: 'verified'
                },
                { 
                    id: 'def456', 
                    email: 'jane.smith@example.com', 
                    name: 'Jane Smith',
                    createdAt: new Date().toISOString(),
                    activeLinks: 1,
                    totalSubmissions: 0,
                    verificationStatus: 'verified'
                },
                { 
                    id: 'ghi789', 
                    email: 'demo@landlord.com', 
                    name: 'Demo Landlord',
                    createdAt: new Date().toISOString(),
                    activeLinks: 1,
                    totalSubmissions: 0,
                    verificationStatus: 'verified'
                }
            ];

            for (const landlord of sampleLandlords) {
                await this.createLandlord(landlord);
            }

            console.log('Sample data seeded successfully');
        } catch (error) {
            console.error('Error seeding data:', error);
            throw error;
        }
    }
}

// Export singleton instance with same interface as before
const azureSQLService = new AzureSQLService();

module.exports = {
    cosmosService: azureSQLService, // Keep same property name for compatibility
    
    // Database operations
    initializeDatabase: () => azureSQLService.initializeDatabase(),
    seedData: () => azureSQLService.seedData(),
    
    // Landlord operations
    getLandlord: (landlordId) => azureSQLService.getLandlord(landlordId),
    createLandlord: (landlordData) => azureSQLService.createLandlord(landlordData),
    updateLandlord: (landlordId, landlordData) => azureSQLService.updateLandlord(landlordId, landlordData),
    validateLandlord: (landlordId) => azureSQLService.getLandlord(landlordId), // Alias for compatibility
    
    // Tenant operations
    getTenant: (email) => azureSQLService.getTenant(email),
    createTenant: (tenantData) => azureSQLService.createTenant(tenantData),
    updateTenant: (email, tenantData) => azureSQLService.updateTenant(email, tenantData),
    getTenantHistory: (email) => azureSQLService.getTenantHistory(email),
    
    // Submission operations
    createSubmission: (submissionData) => azureSQLService.createSubmission(submissionData),
    getSubmission: (submissionId, landlordId) => azureSQLService.getSubmission(submissionId, landlordId),
    getLandlordSubmissions: (landlordId) => azureSQLService.getLandlordSubmissions(landlordId),
    updateSubmission: (submissionId, landlordId, submissionData) => azureSQLService.updateSubmission(submissionId, landlordId, submissionData)
};
