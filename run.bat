@echo off
title IIIT-NR Student Campus Hub - SQLite Backend Server
color 0B
cls
echo ==============================================================
echo 🎓 IIIT-NR Student Campus Hub - Enterprise Application
echo ==============================================================
echo.
echo 💾 Database Engine    : SQLite 3 (backend/database/campus_hub.sqlite)
echo 🚀 Local Machine URL  : http://localhost:5000/
echo 📱 Mobile / Wi-Fi URL : (Check console output below)
echo 🌐 Cross-Network Web  : Run "run-cross-network.bat" for internet access
echo 📡 REST API Base      : http://localhost:5000/api
echo.
echo ⏳ Launching SQLite backend server and opening your browser...
echo.

set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"

:: Automatically open default browser after 1 second
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:5000"

:: Start Express server with SQLite database on 0.0.0.0
node backend/server.js

pause
