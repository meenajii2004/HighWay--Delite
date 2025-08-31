@echo off
echo Switching to network mode...
(Get-Content .env) -replace 'localhost', '172.20.10.2' | Set-Content .env
echo Updated .env file to use network IP
echo Restart your frontend server to apply changes
pause


