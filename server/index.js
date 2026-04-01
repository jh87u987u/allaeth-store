const express = require('express');
const cors = require('cors');
const app = express();

// إعدادات الـ CORS مهمة جداً للسماح بالحذف والتعديل
app.use(cors({
    origin: "*", // يسمح لأي موقع بالاتصال (للتجربة حالياً)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// قائمة المنتجات - غيرناها لـ let عشان نقدر نحذف ونعدل
let products = [
    { id: 1, name: "تيشيرت قطن", price: 150, image: "https://via.placeholder.com/150" },
    { id: 2, name: "بنطلون جينز", price: 300, image: "https://via.placeholder.com/150" }
];

// 1. رابط جلب المنتجات
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 2. رابط إضافة منتج جديد
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: Date.now(), // توليد ID فريد
        name: req.body.name,
        price: Number(req.body.price),
        image: req.body.image
    };
    products.push(newProduct);
    res.json(newProduct);
});

// 3. رابط حذف منتج (DELETE)
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    // نحول الطرفين لنصوص للتأكد من المطابقة
    products = products.filter(p => String(p.id) !== String(id));
    res.json({ message: "تم الحذف بنجاح" });
});

// 4. رابط تعديل السعر (PUT)
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { newPrice } = req.body;
    
    const product = products.find(p => String(p.id) === String(id));
    
    if (product) {
        product.price = Number(newPrice);
        res.json(product);
    } else {
        res.status(404).json({ message: "المنتج غير موجود" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});