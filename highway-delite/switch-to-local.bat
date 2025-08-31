@echo off
echo Switching to localhost mode...
(Get-Content .env) -replace '172.20.10.2', 'localhost' | Set-Content .env
echo Updated .env file to use localhost
echo Restart your frontend server to apply changes
pause


