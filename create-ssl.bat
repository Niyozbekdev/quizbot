@echo off
echo SSL sertifikat yaratilmoqda...

cd web

echo.
echo mkcert o'rnatilmoqda...
npm install -g mkcert

echo.
echo mkcert ishga tushirilmoqda...
mkcert -install

echo.
echo localhost sertifikat yaratilmoqda...
mkcert localhost 127.0.0.1 ::1

echo.
echo Sertifikatlar tayyor!
echo localhost.pem va localhost-key.pem fayllar yaratildi.

echo.
echo Endi web server HTTPS rejimida ishga tushadi.
echo npm run dev ni ishga tushiring.

pause