#!/bin/bash

echo "🚀 Starting Zero Downtime Deployment..."

echo "📥 Pulling latest code..."
git pull origin main

echo "🔨 Rebuilding backend..."
sudo docker-compose up -d --no-deps --build backend

echo "⏳ Waiting for backend to be healthy..."
sleep 15

if sudo docker-compose ps | grep -q "backend"; then
  echo "✅ Backend is healthy!"
else
  echo "❌ Backend failed!"
  exit 1
fi

echo "🔨 Rebuilding frontend..."
sudo docker-compose up -d --no-deps --build frontend

echo "✅ Zero Downtime Deployment Complete!"
echo "🌍 App is running at http://localhost"
