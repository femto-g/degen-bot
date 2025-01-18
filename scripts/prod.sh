#!/bin/bash
set -e

echo "Running migration..."
npx prisma migrate dev --name init || { echo "Migration failed"; exit 1; }

echo "Starting in production mode..."
npm run prod || { echo "Deployment command failed"; exit 1; }
