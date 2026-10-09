@echo off
title IIIT-NR Student Campus Hub - SQLite Backend Server
color 0B
cls
echo ==============================================================
echo 🎓 IIIT-NR Student Campus Hub - Full-Stack Application
echo ==============================================================
echo.
echo 💾 Database Engine : SQLite 3 (backend/database/campus_hub.sqlite)
echo 🚀 Backend Server  : http://localhost:5000
echo 📡 REST API Base   : http://localhost:5000/api
echo 💻 Web Application : http://localhost:5000/
echo.
echo ⏳ Launching SQLite backend server and opening your browser...
echo.

set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0backend"

:: Automatically open default browser after 1 second
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:5000"

:: Start Express server with SQLite database
node server.js

pause
