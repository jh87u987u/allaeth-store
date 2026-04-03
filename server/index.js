const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// إعدادات الـ CORS للسماح بالعمليات (حذف، تعديل، إضافة)
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// إنشاء مجلد الصور إذا لم يكن موجوداً
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// إعداد التخزين للصور المرفوعة
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// قاعدة البيانات المؤقتة
let products = [
    { id: 1, name: "منتج تجريبي", price: 100, category: "عام", rating: 5, image: "https://via.placeholder.com/150" }
];

// جلب المنتجات
app.get('/api/products', (req, res) => { res.json(products); });

// إضافة منتج جديد مع القسم والتقييم
app.post('/api/products', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "يرجى رفع صورة" });
    const newProduct = {
        id: Date.now(),
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category || "عام",
        rating: 5, 
        image: `/uploads/${req.file.filename}`
    };
    products.push(newProduct);
    res.json(newProduct);
});

// حذف منتج
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter(p => String(p.id) !== String(id));
    res.json({ message: "تم الحذف" });
});

// تعديل السعر
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { newPrice } = req.body;
    const product = products.find(p => String(p.id) === String(id));
    if (product) {
        product.price = Number(newPrice);
        res.json(product);
    } else {
        res.status(404).json({ message: "غير موجود" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
