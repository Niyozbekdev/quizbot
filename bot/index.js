const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const { BOT_TOKEN, MONGO_URI, ADMIN_IDS, WEB_APP_URL } = require("./config/config");
const User = require("./models/User");

(async () => {
    try {
        // MongoDB ulanishi
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB ulandi");

        // Bot ishga tushirish
        const bot = new Telegraf(BOT_TOKEN);

        // /start komandasi
        bot.start(async (ctx) => {
            try {
                const userId = ctx.from.id;

                // Foydalanuvchini DB ga qo'shish yoki yangilash
                await User.findOneAndUpdate(
                    { user_id: userId },
                    {
                        username: ctx.from.username,
                        first_name: ctx.from.first_name
                    },
                    { upsert: true, new: true }
                );

                const welcomeMessage = `👋 **Assalomu aleykum, ${ctx.from.first_name}!**

🎯 **QuizBot**ga xush kelibsiz!

📚 Bu bot orqali siz:
• Test savollarini qo'shishingiz
• Quiz o'tkazishingiz  
• Natijalarni kuzatishingiz mumkin

🔧 **Admin bo'lsangiz:** /test buyrug'ini yozing
👤 **Oddiy foydalanuvchi:** Tez orada qo'shimcha funksiyalar qo'shiladi

❓ Yordam kerak bo'lsa: /help`;

                ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
            } catch (err) {
                console.error("❌ /start xatosi:", err);
            }
        });

        // /help komandasi
        bot.help((ctx) => {
            const helpMessage = `❓ **Yordam - QuizBot**

🔧 **Admin komandalar:**
• /test - Test qo'shish paneli
• /stats - Statistikalarni ko'rish  

👤 **Umumiy komandalar:**
• /start - Botni qayta ishga tushirish
• /help - Ushbu yordam

📞 **Qo'llab-quvvatlash:** @admin_username`;

            ctx.reply(helpMessage, { parse_mode: 'Markdown' });
        });

        // /test komandasi (faqat adminlar)
        bot.command("test", async (ctx) => {
            try {
                if (!ADMIN_IDS.includes(ctx.from.id.toString())) {
                    return ctx.reply("⛔ Kechirasiz! Siz admin emassiz. Bu komanda faqat adminlar uchun mo'ljallangan.");
                }

                // Web App URL ni tekshirish
                if (!WEB_APP_URL) {
                    return ctx.reply("❌ Web App URL konfiguratsiya qilinmagan. Iltimos, .env faylini tekshiring.");
                }

                // Localhost uchun maxsus yechim
                if (WEB_APP_URL.includes('localhost')) {
                    await ctx.reply(`🎯 **Test Rejimi**

📝 Quyidagi linkni bosing va "Open Anyway" deb bosing:
${WEB_APP_URL}

⚠️ **SSL ogohlantirishini e'tiborsiz qoldiring**
🔒 Brauzerda "Advanced" > "Proceed to localhost"`, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '🌐 Test sahifasini ochish', url: WEB_APP_URL }
                                ]
                            ]
                        }
                    });
                    return;
                }

                // HTTPS URL bilan WebApp tugmasini yuborish
                const isHTTPS = WEB_APP_URL.startsWith('https://');

                if (!isHTTPS) {
                    await ctx.reply(`❌ **WebApp faqat ishonchli HTTPS URL bilan ishlaydi!**

🔧 **Eng oson yechim:**
1. \`quick-tunnel.bat\` ni ishga tushiring
2. Cloudflare URL ni ko'chirab oling
3. Bot .env ga yozing

💡 **Yoki GitHub Codespaces:**
1. GitHub.com ga boring
2. Repository yarating
3. Codespace oching - avtomatik HTTPS URL beradi

📝 **Hozircha browserda ochish:**`, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '🌐 Browserda ochish', url: WEB_APP_URL }
                                ]
                            ]
                        }
                    });
                    return;
                }

                // Debug ma'lumotlari
                console.log("🔍 URL:", WEB_APP_URL);
                console.log("🔍 HTTPS:", WEB_APP_URL.startsWith('https://'));
                console.log("🔍 Admin ID:", ctx.from.id);
                console.log("🔍 Admin IDs list:", ADMIN_IDS);

                // ✅ Mini Web App tugmasini yuborish
                await ctx.reply(`🎯 **QuizBot Admin Panel**

📝 Mini web sahifada test qo'shish:
URL: ${WEB_APP_URL}

⚡ **Debug info:**
- HTTPS: ${WEB_APP_URL.startsWith('https://') ? '✅' : '❌'}
- Your ID: ${ctx.from.id}
- Admins: ${ADMIN_IDS.join(', ')}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '📋 Test Qo\'shish',
                                    web_app: { url: WEB_APP_URL }
                                }
                            ],
                            [
                                {
                                    text: '🌐 Browserda ochish',
                                    url: WEB_APP_URL
                                }
                            ]
                        ]
                    },
                    parse_mode: 'Markdown'
                });

                console.log("✅ Mini Web App URL yuborildi:", WEB_APP_URL);
            } catch (err) {
                console.error("❌ /test xatosi:", err);
                ctx.reply("❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
            }
        });

        // Callback query handlers
        bot.action('stats', async (ctx) => {
            try {
                await ctx.answerCbQuery();
                ctx.reply("📊 **Statistika**\n\nTez orada qo'shiladi...", { parse_mode: 'Markdown' });
            } catch (err) {
                console.error("❌ Stats xatosi:", err);
            }
        });

        bot.action('list_tests', async (ctx) => {
            try {
                await ctx.answerCbQuery();
                ctx.reply("📚 **Testlar ro'yxati**\n\nTez orada qo'shiladi...", { parse_mode: 'Markdown' });
            } catch (err) {
                console.error("❌ List tests xatosi:", err);
            }
        });

        // Matn orqali test qo'shish
        bot.on('text', async (ctx) => {
            try {
                const text = ctx.message.text;

                // Test formatini tekshirish
                if (text.includes('SAVOL:') && text.includes('JAVOB:')) {
                    if (!ADMIN_IDS.includes(ctx.from.id.toString())) {
                        return;
                    }

                    // Test ma'lumotlarini ajratish
                    const lines = text.split('\n').map(line => line.trim());

                    let question = '';
                    let options = [];
                    let correctAnswer = '';

                    for (const line of lines) {
                        if (line.startsWith('SAVOL:')) {
                            question = line.replace('SAVOL:', '').trim();
                        } else if (line.match(/^[A-D]\)/)) {
                            options.push(line.substring(3).trim());
                        } else if (line.startsWith('JAVOB:')) {
                            correctAnswer = line.replace('JAVOB:', '').trim().toUpperCase();
                        }
                    }

                    // Validatsiya
                    if (!question || options.length !== 4 || !['A', 'B', 'C', 'D'].includes(correctAnswer)) {
                        return ctx.reply('❌ Noto\'g\'ri format! Iltimos, to\'g\'ri formatda yuboring.');
                    }

                    // Test saqlash
                    try {
                        const newUser = new User({
                            user_id: 999999,
                            username: 'test_question',
                            first_name: question.substring(0, 50)
                        });

                        await newUser.save();

                        ctx.reply(`✅ **Test saqlandi!**

📝 **Savol:** ${question}
🔤 **Variantlar:**
A) ${options[0]}
B) ${options[1]}  
C) ${options[2]}
D) ${options[3]}
✅ **To'g'ri javob:** ${correctAnswer}`, { parse_mode: 'Markdown' });

                    } catch (saveErr) {
                        console.error('Test saqlashda xato:', saveErr);
                        ctx.reply('❌ Test saqlashda xatolik yuz berdi.');
                    }
                }
            } catch (err) {
                console.error('Matn ishlovida xato:', err);
            }
        });

        bot.launch();
        console.log("🚀 Bot ishga tushdi");
    } catch (err) {
        console.error("❌ Botni ishga tushirishda xato:", err);
    }
})();