@echo off
chcp 65001 >nul
where node >nul 2>nul || (echo Установи Node.js с https://nodejs.org и запусти снова & pause & exit /b 1)
set /p URL=Вставь ссылку на релиз с паками (https://github.com/ИМЯ/РЕПО/releases/download/packs/): 
call npm install || (pause & exit /b 1)
node tools\make-catalog.js %URL%
explorer catalog-dist
pause
