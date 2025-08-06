@echo off
echo Full-stack deploy...

echo.
echo 1. Dependencies o'rnatilmoqda...
npm run install:all

echo.
echo 2. Vercel o'rnatilmoqda...
npm install -g vercel

echo.
echo 3. Web build qilinmoqda...
npm run build

echo.
echo 4. Deploy qilinmoqda...
vercel --prod

echo.
echo DEPLOY TUGADI!
echo Sizga URL berdi - uni bot .env ga yozing!
echo.
echo Misol:
echo WEB_APP_URL=https://quizbot-abc123.vercel.app
echo.
pause