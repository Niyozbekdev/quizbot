@echo off
echo Vercel deploy...

cd web

echo.
echo 1. Vercel o'rnatilmoqda...
npm install -g vercel

echo.
echo 2. Build qilinmoqda...
npm run build

echo.
echo 3. Deploy qilinmoqda...
echo Birinchi marta bo'lsa, email/GitHub bilan login qiling
vercel --prod

echo.
echo Deploy tugadi! URL ni ko'chirib oling va bot .env ga yozing!
pause