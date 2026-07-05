#!/bin/bash

echo "🔍 Checking PostgreSQL Docker container status..."
echo ""

# Check container status
if docker-compose ps | grep -q "safe-net-postgres.*Up"; then
    echo "✅ Container is running"
    docker-compose ps
    echo ""
    echo "📋 Container logs (last 20 lines):"
    docker-compose logs postgres --tail=20
else
    echo "❌ Container is not running or not found"
    echo ""
    echo "Starting container..."
    docker-compose up -d
    echo ""
    echo "Waiting for the database to become ready (10 seconds)..."
    sleep 10
    docker-compose ps
fi

echo ""
echo "🔌 Checking port 5433 availability..."
if lsof -i :5433 > /dev/null 2>&1; then
    echo "✅ Port 5433 is in use (expected when the container is running)"
    lsof -i :5433
else
    echo "⚠️  Port 5433 is free (the container may not be running)"
fi
