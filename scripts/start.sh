#!/bin/bash
set -e

echo "Running migration..."
npx prisma migrate dev --name init || { echo "Migration failed"; exit 1; }

echo "Starting development..."
npm run dev || { echo "Dev command failed"; exit 1; }
