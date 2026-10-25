@echo off
title IIIT-NR Student Campus Hub - Cross-Network & Public Access
color 0A
cls
echo ==============================================================
echo 🌐 IIIT-NR Campus Hub - Cross-Network Device Access Launcher
echo ==============================================================
echo.
echo This tool lets any device (mobile on 4G/5G, friends on different
echo Wi-Fi networks, remote devices) access your live Campus Hub!
echo.
echo ⏳ Starting local backend server and generating public link...
echo.

set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"

start /b "" node backend/server.js
timeout /t 2 /nobreak >nul
node backend/scripts/tunnel.js

pause
