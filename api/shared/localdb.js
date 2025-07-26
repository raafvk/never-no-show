const fs = require('fs').promises;
const path = require('path');

// Local database using JSON files
class LocalJSONDatabase {
    constructor() {
        this.dataDir = path.join(__dirname, 'local-data');
        this.ensureDataDirectory();
    }

    async ensureDataDirectory() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
        } catch (error) {
            // Directory already exists
        }
    }

    // Helper to read JSON file
    async readCollection(collectionName) {
        try {
            const filePath = path.join(this.dataDir, `${collectionName}.json`);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // File doesn't exist, return empty array
            return [];
        }
    }

    // Helper to write JSON file
    async writeCollection(collectionName, data) {
        const filePath = path.join(this.dataDir, `${collectionName}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    // Landlord operations
    async getLandlord(landlordId) {
        const landlords = await this.readCollection('landlords');
        return landlords.find(l => l.id === landlordId) || null;
    }

    async createLandlord(landlordData) {
        const landlords = await this.readCollection('landlords');
        landlords.push(landlordData);
        await this.writeCollection('landlords', landlords);
        return landlordData;
    }

    async updateLandlord(landlordId, landlordData) {
        const landlords = await this.readCollection('landlords');
        const index = landlords.findIndex(l => l.id === landlordId);
        if (index !== -1) {
            landlords[index] = landlordData;
            await this.writeCollection('landlords', landlords);
        }
        return landlordData;
    }

    // Tenant operations
    async getTenant(email) {
        const tenants = await this.readCollection('tenants');
        return tenants.find(t => t.email === email) || null;
    }

    async createTenant(tenantData) {
        const tenants = await this.readCollection('tenants');
        tenants.push(tenantData);
        await this.writeCollection('tenants', tenants);
        return tenantData;
    }

    async updateTenant(email, tenantData) {
        const tenants = await this.readCollection('tenants');
        const index = tenants.findIndex(t => t.email === email);
        if (index !== -1) {
            tenants[index] = tenantData;
            await this.writeCollection('tenants', tenants);
        }
        return tenantData;
    }

    async getTenantHistory(email) {
        const submissions = await this.readCollection('submissions');
        return submissions.filter(s => s.tenantEmail === email)
                         .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    // Submission operations
    async createSubmission(submissionData) {
        const submissions = await this.readCollection('submissions');
        submissions.push(submissionData);
        await this.writeCollection('submissions', submissions);
        return submissionData;
    }

    async getSubmission(submissionId, landlordId) {
        const submissions = await this.readCollection('submissions');
        return submissions.find(s => s.id === submissionId && s.landlordId === landlordId) || null;
    }

    async getLandlordSubmissions(landlordId) {
        const submissions = await this.readCollection('submissions');
        return submissions.filter(s => s.landlordId === landlordId)
                         .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    async updateSubmission(submissionId, landlordId, submissionData) {
        const submissions = await this.readCollection('submissions');
        const index = submissions.findIndex(s => s.id === submissionId && s.landlordId === landlordId);
        if (index !== -1) {
            submissions[index] = submissionData;
            await this.writeCollection('submissions', submissions);
        }
        return submissionData;
    }

    // Initialize with sample data
    async initializeDatabase() {
        console.log('Initializing local JSON database...');
        
        // Create empty collections if they don't exist
        await this.readCollection('landlords');
        await this.readCollection('tenants');
        await this.readCollection('submissions');
        
        console.log('Local database initialized successfully');
        return true;
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

// Export singleton instance
const localDB = new LocalJSONDatabase();

module.exports = {
    localDBService: localDB,
    initializeDatabase: () => localDB.initializeDatabase(),
    seedData: () => localDB.seedData()
};
