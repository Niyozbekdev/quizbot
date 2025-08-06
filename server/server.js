const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGO_URI, PORT } = require("./config/config");

// Demo rejim - MongoDB siz
const app = express();
app.use(cors());
app.use(express.json());

// API yo'llari
app.use("/api/tests", require("./routes/testRoutes"));

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`🚀 Server demo rejimda http://localhost:${PORT} da ishlamoqda`);
});