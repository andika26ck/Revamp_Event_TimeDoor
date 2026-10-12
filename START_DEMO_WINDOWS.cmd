@echo off
cd /d "%~dp0"
echo Starting Timedoor demo at http://localhost:3000
echo Keep this window open while presenting.
node scripts\serve.mjs
pause
