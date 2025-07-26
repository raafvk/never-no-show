#!/bin/bash

# Test Production Configuration Locally
# This script simulates production environment by setting NODE_ENV=production

echo "Testing NeverNoShow with production configuration..."
echo ""

# Set production environment variables
export NODE_ENV=production
export AZURE_SQL_SERVER=nevernoshow-server-mrvk.database.windows.net
export AZURE_SQL_DATABASE=nevernoshow-db
export AZURE_SQL_USERNAME=sqladmin
export AZURE_SQL_PASSWORD=Mgpiab@18nov2020

echo "Environment set to production mode"
echo "Using Azure SQL Database: $AZURE_SQL_SERVER/$AZURE_SQL_DATABASE"
echo ""

# Function to start Azure Functions in background
start_functions() {
    echo "Starting Azure Functions in production mode..."
    cd api
    func start &
    FUNC_PID=$!
    cd ..
    echo "Azure Functions started with PID: $FUNC_PID"
}

# Function to start Next.js frontend
start_frontend() {
    echo "Starting Next.js development server..."
    npm run dev &
    NEXT_PID=$!
    echo "Next.js started with PID: $NEXT_PID"
}

# Function to cleanup processes
cleanup() {
    echo ""
    echo "Shutting down services..."
    if [ ! -z "$FUNC_PID" ]; then
        kill $FUNC_PID 2>/dev/null
        echo "Azure Functions stopped"
    fi
    if [ ! -z "$NEXT_PID" ]; then
        kill $NEXT_PID 2>/dev/null
        echo "Next.js stopped"
    fi
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start services
start_functions
sleep 5  # Wait for functions to start
start_frontend

echo ""
echo "🚀 Services started successfully!"
echo ""
echo "Frontend: http://localhost:3000"
echo "API: http://localhost:7071/api"
echo ""
echo "Test URLs:"
echo "- Landlord form: http://localhost:3000/check?landlord=abc123"
echo "- API test: http://localhost:7071/api/landlords/abc123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
while true; do
    sleep 1
done
