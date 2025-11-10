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
    chmod 666 "$DB_PATH"
    chmod 755 "$(dirname "$DB_PATH")"
fi

# Verify database is accessible
if [ ! -w "$DB_PATH" ]; then
    echo "Warning: Database file is not writable, fixing permissions..."
    chmod 666 "$DB_PATH"
fi

# Test database connection
echo "Testing database connection..."
php artisan tinker --execute="echo 'DB connection: ' . (DB::connection()->getPdo() ? 'OK' : 'FAILED');" || {
    echo "Database connection failed, recreating..."
    rm -f "$DB_PATH"
    touch "$DB_PATH"
    chmod 666 "$DB_PATH"
}

# Run Laravel commands
echo "Running storage link..."
php artisan storage:link || true   # skip if already exists

echo "Running migrations and seeding..."
php artisan migrate:fresh --seed || {
    echo "Migration failed, trying without fresh..."
    php artisan migrate --force
    php artisan db:seed --force
}

# Verify pins exist
echo "Verifying pins in database..."
php artisan tinker --execute="echo 'Active pins count: ' . App\Models\Pin::where('is_active', true)->count();" || echo "Pin verification failed"

# Start Laravel development server
echo "Starting Laravel server on port 8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
