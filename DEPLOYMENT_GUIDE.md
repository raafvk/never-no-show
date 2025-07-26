# Azure Static Web Apps Environment Variables Configuration

## Steps to configure Azure SQL Database for your deployed website:

### 1. Go to Azure Portal
- Navigate to https://portal.azure.com
- Find your Static Web App resource (likely named "black-wave-0cec0c00f" or similar)

### 2. Add Environment Variables
In your Static Web App resource:
- Go to "Configuration" in the left sidebar
- Click "Application settings"
- Add these environment variables:

```
AZURE_SQL_SERVER=nevernoshow-server-mrvk.database.windows.net
AZURE_SQL_DATABASE=nevernoshow-db
AZURE_SQL_USERNAME=nevernoshow-admin
AZURE_SQL_PASSWORD=<your-password-from-local.settings.json>
NODE_ENV=production
```

### 3. Alternative: Use GitHub Secrets (Recommended for security)
Instead of adding directly to Azure, add these as GitHub repository secrets:
- Go to your GitHub repository
- Settings → Secrets and variables → Actions
- Add repository secrets:
  - `AZURE_SQL_SERVER`
  - `AZURE_SQL_DATABASE` 
  - `AZURE_SQL_USERNAME`
  - `AZURE_SQL_PASSWORD`

### 4. Update the GitHub Workflow
Add environment variables to the deployment step in the workflow file.

### 5. Verify Database Connection
After deployment, the API will use Azure SQL Database instead of local JSON files.

## Testing URLs (after deployment):
- Landlord validation: `https://your-site.azurestaticapps.net/api/landlords/abc123`
- Form submission: `https://your-site.azurestaticapps.net/api/submissions`

## Frontend Integration
The frontend will automatically use the deployed API endpoints when running on the production domain.
