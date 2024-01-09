#!/bin/bash
# Usage: Run CSV to SQL Inserter
# Author: Dave Gray
# ------------------------------------------------- #
echo "Removing node modules & dist (if have)"
# Check if the directory exists before attempting to remove it
if [ -d "node_modules" ] || [ -d "dist" ]; then
    sudo rm -rf node_modules/ dist
    echo "node_modules and dist removed"
else
    echo "node_modules and dist not found"
fi
sudo npm i pnpm -g
echo "Install all dependencies"
pnpm install
echo "Install all dependencies"
pnpm start