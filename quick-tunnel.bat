@echo off
echo Tez tunnel yaratish...

echo.
echo 1. Web server ishga tushirilmoqda...
start "Web Server" cmd /k "cd web && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo 2. Cloudflare tunnel ishga tushirilmoqda...
echo Quyidagi URL ni ko'chirib oling va bot .env ga yozing!
echo.

npx cloudflared tunnel --url http://localhost:5173

pause