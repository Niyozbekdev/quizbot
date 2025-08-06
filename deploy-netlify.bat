@echo off
echo Netlify uchun build...

cd web

echo.
echo Build qilinmoqda...
npm run build

echo.
echo BUILD TUGADI!
echo.
echo 1. dist papkasini oching
echo 2. netlify.com ga boring
echo 3. "Drag and drop your site folder here" ga dist papkasini sudrang
echo 4. URL ni ko'chirib oling
echo.

explorer dist

echo URL tayyor bo'lganda bot .env ga yozing!
pause