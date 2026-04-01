const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// 1. إعدادات الـ CORS للسماح بالاتصال والحذف والتعديل
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 2. جعل مجلد uploads عاماً ليتمكن المتصفح من عرض الصور
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// التأكد من وجود مجلد uploads، وإذا لم يوجد يتم إنشاؤه تلقائياً
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// 3. إعداد multer لتخزين الصور بأسماء فريدة
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// قاعدة البيانات المؤقتة
let products = [
    { id: 1, name: "تيشيرت قطن", price: 150, image: "https://via.placeholder.com/150" }
];

// --- الروابط (Routes) ---

// جلب المنتجات
app.get('/api/products', (req, res) => {
    res.json(products);
});

// إضافة منتج جديد مع صورة (File Upload)
app.post('/api/products', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "الرجاء رفع صورة للمنتج" });
    }

    const newProduct = {
        id: Date.now(),
        name: req.body.name,
        price: Number(req.body.price),
        image: `/uploads/${req.file.filename}` // مسار الصورة في السيرفر
    };
    
    products.push(newProduct);
    res.json(newProduct);
});

// حذف منتج
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter(p => String(p.id) !== String(id));
    res.json({ message: "تم الحذف بنجاح" });
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
        res.status(404).json({ message: "المنتج غير موجود" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
