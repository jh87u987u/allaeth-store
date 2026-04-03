const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// 1. إعدادات الـ CORS المحدثة (تسمح بكل العمليات)
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 2. جعل مجلد uploads عاماً (Public) لعرض الصور
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// التأكد من وجود مجلد uploads لمنع خطأ الـ 500
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

// قاعدة البيانات المؤقتة (أضفنا Category و Rating)
let products = [
    { 
        id: 1, 
        name: "تيشيرت علاث الأصلي", 
        price: 150, 
        category: "ملابس", 
        rating: 5, 
        image: "https://via.placeholder.com/150" 
    }
];

// --- الروابط (Routes) ---

// 1. جلب كل المنتجات
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 2. إضافة منتج جديد (دعم الأقسام والتقييم)
app.post('/api/products', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "الرجاء رفع صورة للمنتج" });
    }

    const newProduct = {
        id: Date.now(),
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category || "عام", // استقبال القسم من الفرونت
        rating: Math.floor(Math.random() * 2) + 4, // تقييم عشوائي بين 4 و 5 نجوم للمنتجات الجديدة
        image: `/uploads/${req.file.filename}`
    };
    
    products.push(newProduct);
    res.json(newProduct);
});

// 3. حذف منتج
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter(p => String(p.id) !== String(id));
    res.json({ message: "تم الحذف بنجاح" });
});

// 4. تعديل سعر منتج
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

// 5. رابط تجريبي للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
    res.send("Allaeth Store Server is Running! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
