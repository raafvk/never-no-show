// Simple script to seed Azure SQL Database
// Run with: node seed-database.js

const { seedData } = require('./shared/database');

async function runSeed() {
    try {
        console.log('🌱 Seeding Azure SQL Database...');
        await seedData();
        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.log('❌ Seeding failed:', error.message);
    }
}

runSeed();
