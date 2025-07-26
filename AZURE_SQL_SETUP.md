# Azure SQL Database Setup Guide

## Step-by-Step Setup

### 1. Create Azure SQL Database

1. **Sign in to Azure Portal**:
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account (create free account if needed)

2. **Create SQL Database**:
   - Click "Create a resource"
   - Search for "SQL Database"
   - Click "Create"

3. **Configure Database**:
   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new or use existing
   - **Database Name**: `nevernoshow`
   - **Server**: Click "Create new"

4. **Configure Server**:
   - **Server Name**: Choose unique name (e.g., `nevernoshow-server-123`)
   - **Location**: Choose region closest to you
   - **Authentication**: SQL Authentication
   - **Server Admin Login**: Choose username (e.g., `sqladmin`)
   - **Password**: Choose strong password
   - Click "OK"

5. **Configure Compute + Storage**:
   - Click "Configure database"
   - **Service Tier**: General Purpose
   - **Compute Tier**: Serverless
   - **Hardware**: Standard-series (Gen5)
   - **Min vCores**: 0.5
   - **Max vCores**: 2
   - **Auto-pause**: Enabled (1 hour)
   - **Storage**: 32 GB
   - Click "Apply"

6. **Create Database**:
   - Review settings
   - Click "Create"
   - Wait for deployment (2-3 minutes)

### 2. Configure Firewall

1. **Go to SQL Server**:
   - Navigate to your SQL Server (not database)
   - Click "Networking" in left menu

2. **Add Client IP**:
   - Check "Allow Azure services and resources to access this server"
   - Click "Add your client IPv4 address"
   - Click "Save"

### 3. Get Connection Details

1. **Database Connection String**:
   - Go to your SQL Database
   - Click "Connection strings" in left menu
   - Copy the ADO.NET connection string

2. **Extract Details**:
   - **Server**: `your-server.database.windows.net`
   - **Database**: `nevernoshow`
   - **Username**: Your admin login
   - **Password**: Your admin password

### 4. Update Local Configuration

Edit `api/local.settings.json`:

```json
{
  "Values": {
    "USE_LOCAL_DB": "false",
    "AZURE_SQL_SERVER": "your-server.database.windows.net",
    "AZURE_SQL_DATABASE": "nevernoshow",
    "AZURE_SQL_USERNAME": "sqladmin",
    "AZURE_SQL_PASSWORD": "your-password",
    "AZURE_SQL_ENCRYPT": "true",
    "AZURE_SQL_TRUST_CERT": "false"
  }
}
```

### 5. Test Connection

1. **Start Azure Functions**:
   ```bash
   cd api
   npm start
   ```

2. **Initialize Database**:
   ```bash
   curl http://localhost:7071/api/init-database
   ```

   Expected response:
   ```json
   {
     "success": true,
     "message": "Database initialized successfully",
     "tables": ["landlords", "submissions"],
     "sampleData": "inserted"
   }
   ```

3. **Test Landlord Endpoint**:
   ```bash
   curl http://localhost:7071/api/landlords/landlord1
   ```

   Expected response:
   ```json
   {
     "valid": true,
     "landlord": {
       "id": "landlord1",
       "name": "John Smith",
       "email": "john.smith@example.com"
     }
   }
   ```

## Azure SQL Serverless Tier Benefits

- **Storage**: 32 GB (first 32 GB free)
- **Compute**: 0.5-2 vCores (auto-scaling, first 100,000 vCore seconds free)
- **Auto-pause**: Pauses after 1 hour of inactivity (saves costs)
- **Cost**: Pay only for what you use, excellent for PoC
- **Performance**: Much better than Basic DTU tier
- **Connections**: Up to 30 concurrent connections

## Troubleshooting

### Connection Issues
- **Firewall**: Ensure your IP is whitelisted
- **Credentials**: Double-check username/password
- **Server Name**: Include `.database.windows.net`

### Performance Issues
- **DTU Limit**: Basic tier has 5 DTU limit (adequate for PoC)
- **Upgrade**: Can upgrade to Standard for more performance

### Development Tips
- **Use Local DB**: Set `USE_LOCAL_DB=true` for offline development
- **Query Editor**: Use Azure Portal Query Editor to inspect data
- **Monitoring**: Check Azure Portal for performance metrics

## Next Steps

After successful setup:

1. **Test the full application**:
   ```bash
   npm run dev
   ```

2. **Visit**: `http://localhost:3000/check?landlord=landlord1`

3. **Submit a test form** and verify data persistence

4. **Deploy to Azure Static Web Apps** for production testing
