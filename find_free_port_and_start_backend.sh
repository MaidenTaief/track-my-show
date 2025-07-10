#!/bin/bash

# Kill any existing backend processes first
echo "🧹 Cleaning up any existing backend processes..."
pkill -f "yarn dev" 2>/dev/null || true
pkill -f "ts-node-dev" 2>/dev/null || true
sleep 2

echo "🔍 Finding a free port in range 8000-9000..."
FREE_PORT=$(for port in {8000..9000}; do 
  (echo > /dev/tcp/localhost/$port) >/dev/null 2>&1 && continue || { echo $port; break; }
done)

if [ -z "$FREE_PORT" ]; then
  echo "❌ No free port found in range 8000-9000."
  exit 1
fi

echo "✅ Using port $FREE_PORT"

# Update .env files
echo "PORT=$FREE_PORT" > "backend/.env"
echo "VITE_API_URL=http://localhost:$FREE_PORT/api" > "frontend/.env"

echo "📝 Updated .env files"
echo "🚀 Starting backend server on port $FREE_PORT..."

# Start backend in background and capture PID
cd backend
nohup yarn dev > ../backend.log 2>&1 &
BACKEND_PID=$!

echo "🎯 Backend started with PID $BACKEND_PID"
echo "📋 Logs: tail -f backend.log"
echo "🏥 Health check: http://localhost:$FREE_PORT/health" 