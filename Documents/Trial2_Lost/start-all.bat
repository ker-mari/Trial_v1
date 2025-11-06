@echo off
echo Starting optimized Backend and Frontend servers...

echo.
echo Optimizing Laravel cache...
cd /d backend
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo.
echo Starting Laravel Backend on port 8000...
start "Laravel Backend" cmd /k "php artisan serve --host=0.0.0.0 --port=8000"

echo.
echo Waiting 2 seconds for backend to start...
timeout /t 2 /nobreak > nul

echo.
echo Starting React Frontend on port 3000...
cd /d ../my-app
start "React Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Performance optimizations applied!
pause