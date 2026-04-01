const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://allaeth-store-frontend.onrender.com", // رابط موقعك
    methods: ["GET", "POST","PUT","DELETE"
    ],
    allowedHeaders: ["Content-Type"]
}));

// قائمة منتجات تجريبية نضعها في قاعدة البيانات أو نرسلها مباشرة
let products = [
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

// 1. رابط حذف منتج (Delete)
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    // نقوم بتصفية المصفوفة وحذف المنتج الذي يحمل هذا الرقم
    products = products.filter(p => p.id !== parseInt(id));
    res.json({ message: "تم الحذف بنجاح" });
});

// 2. رابط تعديل السعر (Update)
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { newPrice } = req.body;
    
    // البحث عن المنتج لتعديله
    const product = products.find(p => p.id === parseInt(id));
    
    if (product) {
        product.price = Number(newPrice);
        res.json(product);
    } else {
        res.status(404).json({ message: "المنتج غير موجود" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log("السيرفر يعمل على منفذ: " + PORT);
});