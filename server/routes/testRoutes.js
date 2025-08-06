const express = require("express");
const router = express.Router();
const Test = require("../models/Test");

// Test qo'shish
router.post("/", async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;
        
        // Asosiy validatsiya
        if (!question || !options || !correctAnswer) {
            return res.status(400).json({ 
                success: false,
                message: "Barcha maydonlarni to'ldiring" 
            });
        }

        // Savol validatsiyasi
        if (typeof question !== 'string' || question.trim().length < 10) {
            return res.status(400).json({ 
                success: false,
                message: "Savol kamida 10 ta belgidan iborat bo'lishi kerak" 
            });
        }

        // Variantlar validatsiyasi
        if (!Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({ 
                success: false,
                message: "4 ta variant kiritilishi kerak" 
            });
        }

        for (let i = 0; i < options.length; i++) {
            if (typeof options[i] !== 'string' || options[i].trim().length === 0) {
                return res.status(400).json({ 
                    success: false,
                    message: `${String.fromCharCode(65 + i)} variantini kiriting` 
                });
            }
        }

        // To'g'ri javob validatsiyasi
        if (!["A", "B", "C", "D"].includes(correctAnswer.toUpperCase())) {
            return res.status(400).json({ 
                success: false,
                message: "To'g'ri javob A, B, C yoki D bo'lishi kerak" 
            });
        }

        // Test yaratish
        const newTest = await Test.create({ 
            question: question.trim(), 
            options: options.map(opt => opt.trim()), 
            correctAnswer: correctAnswer.toUpperCase() 
        });

        res.status(201).json({
            success: true,
            message: "Test muvaffaqiyatli qo'shildi",
            data: newTest
        });
    } catch (err) {
        console.error("❌ Test qo'shishda xato:", err);
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: "Ma'lumotlar formati noto'g'ri" 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Server xatosi. Qaytadan urinib ko'ring" 
        });
    }
});

// Testlarni olish
router.get("/", async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: tests,
            count: tests.length,
            message: "Testlar muvaffaqiyatli olingan"
        });
    } catch (err) {
        console.error("❌ Testlarni olishda xato:", err);
        res.status(500).json({ 
            success: false,
            message: "Server xatosi" 
        });
    }
});

// Bitta testni olish
router.get("/:id", async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        
        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test topilmadi"
            });
        }

        res.json({
            success: true,
            data: test,
            message: "Test muvaffaqiyatli olingan"
        });
    } catch (err) {
        console.error("❌ Testni olishda xato:", err);
        res.status(500).json({ 
            success: false,
            message: "Server xatosi" 
        });
    }
});

// Testni o'chirish
router.delete("/:id", async (req, res) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);
        
        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test topilmadi"
            });
        }

        res.json({
            success: true,
            message: "Test muvaffaqiyatli o'chirildi"
        });
    } catch (err) {
        console.error("❌ Testni o'chirishda xato:", err);
        res.status(500).json({ 
            success: false,
            message: "Server xatosi" 
        });
    }
});

module.exports = router;