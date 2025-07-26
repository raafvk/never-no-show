#!/bin/bash

# GitHub Secrets Setup Script for NeverNoShow Azure SQL Database
# Run this script or set these secrets manually in GitHub

echo "Setting up GitHub Repository Secrets for Azure SQL Database..."
echo ""
echo "Go to your GitHub repository: https://github.com/YOUR_USERNAME/nevernoshow"
echo "Navigate to: Settings → Secrets and variables → Actions → Repository secrets"
echo ""
echo "Add these secrets:"
echo ""
echo "Name: AZURE_SQL_SERVER"
echo "Value: nevernoshow-server-mrvk.database.windows.net"
echo ""
echo "Name: AZURE_SQL_DATABASE" 
echo "Value: nevernoshow-db"
echo ""
echo "Name: AZURE_SQL_USERNAME"
echo "Value: sqladmin"
echo ""
echo "Name: AZURE_SQL_PASSWORD"
echo "Value: Mgpiab@18nov2020"
echo ""
echo "After adding these secrets, commit and push your code changes to trigger a new deployment."
echo ""
echo "Your deployed site will then use Azure SQL Database for all data operations!"
