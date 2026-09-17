@echo off
echo ============================================
echo EVINTO Event Management System
echo ============================================
echo.
echo Starting Backend Server...
cd backend
start "EVINTO Backend" cmd /k "node server.js"
cd ..
echo.
echo Starting Frontend Development Server...
cd Frontend1
start "EVINTO Frontend" cmd /k "npm run dev"
cd ..
echo.
echo ============================================
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo ============================================
echo.
echo Press any key to exit this window (servers will continue running)
pause >nul