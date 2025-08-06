const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    MONGO_URI: process.env.MONGO_URI,
    ADMIN_IDS: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",") : [],
    WEB_APP_URL: process.env.WEB_APP_URL
};