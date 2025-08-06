const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    username: String,
    first_name: String,
    language: { type: String, default: "uz" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);