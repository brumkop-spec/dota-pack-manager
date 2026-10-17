@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul || (echo Install Node.js LTS from https://nodejs.org and run this file again & pause & exit /b 1)
call npm install || (pause & exit /b 1)
call npm run build || (pause & exit /b 1)
echo.
echo DONE. Installer is in the "dist" folder: Dota2PackManager-Setup-*.exe
explorer dist
pause
