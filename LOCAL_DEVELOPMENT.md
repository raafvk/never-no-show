# Local Testing Guide - Full Application with Azure SQL

## Option 1: Quick Test (Recommended)

### Step 1: Start Azure Functions with Production Config
```bash
# Terminal 1 - Start API with production environment
cd /Users/mohamedrafivaramangaleth/nevernoshow/api
export NODE_ENV=production
export AZURE_SQL_SERVER=nevernoshow-server-mrvk.database.windows.net
export AZURE_SQL_DATABASE=nevernoshow-db
export AZURE_SQL_USERNAME=sqladmin
export AZURE_SQL_PASSWORD=Mgpiab@18nov2020
func start
```

### Step 2: Start Next.js Frontend
```bash
# Terminal 2 - Start frontend (from project root)
cd /Users/mohamedrafivaramangaleth/nevernoshow
npm run dev
```

### Step 3: Test in Browser
Open your browser and test these URLs:

1. **Homepage**: http://localhost:3000
2. **Landlord Form**: http://localhost:3000/check?landlord=abc123
3. **API Test**: http://localhost:7071/api/landlords/abc123

## Option 2: Use the Test Script
```bash
# Run the automated test script
./test-production.sh
```

## What to Test

### 1. Landlord Validation
- Visit: http://localhost:3000/check?landlord=abc123
- Should load the tenant form (landlord exists)
- Visit: http://localhost:3000/check?landlord=invalid
- Should show "Invalid landlord link" error

### 2. Form Submission
- Fill out the form at: http://localhost:3000/check?landlord=abc123
- Submit and verify:
  - Success message appears
  - Credibility score is calculated
  - Data is saved to Azure SQL Database

### 3. API Endpoints
Test these directly in browser or with curl:
- http://localhost:7071/api/landlords/abc123 (should return landlord data)
- http://localhost:7071/api/landlords/def456 (another test landlord)
- http://localhost:7071/api/landlords/invalid (should return not found)

### 4. Database Verification
```bash
# Check what's in the database
cd /Users/mohamedrafivaramangaleth/nevernoshow/api
node view-database.js
```

## Expected Behavior
- ✅ Frontend connects to local API (localhost:7071)
- ✅ API uses Azure SQL Database (not local JSON)
- ✅ Form submissions are saved to Azure SQL
- ✅ Landlord validation works with real database data
- ✅ All features work exactly like production will

## Troubleshooting
If something doesn't work:
1. Check Azure Functions logs in Terminal 1
2. Check Next.js logs in Terminal 2
3. Verify database connection with `node test-azuresql.js`
4. Ensure all environment variables are set correctly
