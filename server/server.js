const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGO_URI, PORT } = require("./config/config");

(async () => {
    try {
        // MongoDB ulanishi
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB ulandi (Server)");

        const app = express();
        app.use(cors());
        app.use(express.json());

        // API yo‘llari
        app.use("/api/tests", require("./routes/testRoutes"));

        // Serverni ishga tushirish
        app.listen(PORT, () => {
            console.log(`🚀 Server http://localhost:${PORT} da ishlamoqda`);
        });
    } catch (err) {
        console.error("❌ Serverni ishga tushirishda xato:", err);
    }
})();