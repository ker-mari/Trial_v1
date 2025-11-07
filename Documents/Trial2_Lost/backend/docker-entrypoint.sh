#!/bin/bash
set -e

# ------------------------------
# Laravel container startup script
# ------------------------------

DB_PATH="database/database.sqlite"

# Ensure the SQLite database file exists
if [ ! -f "$DB_PATH" ]; then
    echo "Creating SQLite database file..."
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
    chmod 777 "$DB_PATH"
fi

# Run Laravel commands
echo "Running storage link..."
php artisan storage:link || true   # skip if already exists

echo "Running migrations and seeding..."
php artisan migrate:fresh --seed

# Start Laravel development server
echo "Starting Laravel server on port 8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
