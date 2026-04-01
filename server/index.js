const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://allaeth-store-frontend.onrender.com", // رابط موقعك
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// قائمة منتجات تجريبية نضعها في قاعدة البيانات أو نرسلها مباشرة
const products = [
    { id: 1, name: 'سماعات محيطية', price: 250 },
    { id: 2, name: 'ماوس جيمنج', price: 120 },
    { id: 3, name: 'كيبورد ميكانيكي', price: 350 }
];

// رابط لجلب المنتجات
app.get('/api/products', (req, res) => {
    // رابط لإضافة منتج جديد
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: Date.now(), // رقم تعريف عشوائي
        name: req.body.name,
        price: req.body.price,
        image: req.body.image
    };
    products.push(newProduct); // بنضيفه للمصفوفة (مؤقتاً قبل ما نربط الـ Save في الداتابيز)
    res.json(newProduct);
});
    res.json(products);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log("السيرفر يعمل على منفذ: " + PORT);
});