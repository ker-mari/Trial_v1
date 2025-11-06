@echo off
echo Optimizing Lost & Found System...

echo.
echo [1/4] Clearing Laravel caches...
cd /d backend
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo.
echo [2/4] Running database migrations...
php artisan migrate --force

echo.
echo [3/4] Optimizing Laravel for production...
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo.
echo [4/4] Installing/updating frontend dependencies...
cd /d ../my-app
npm install

echo.
echo Optimization complete!
echo Run start-all.bat to start the servers.
pause