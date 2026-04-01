import React, { useState } from 'react';

function Admin() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    
    // --- الجزء الجديد للحماية ---
    const [secretCode, setSecretCode] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const MY_SECRET_PASSWORD = "allaeth_secret_2024"; // غير هذه الكلمة لأي كود تريده

    const handleLogin = () => {
        if (secretCode === MY_SECRET_PASSWORD) {
            setIsAuthorized(true);
        } else {
            alert("الكود غير صحيح! لا تملك صلاحية الإضافة.");
        }
    };
    // -------------------------

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = { name, price: Number(price), image };

        fetch('https://allaeth-store-1.onrender.com/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        })
        .then(() => {
            alert("تمت إضافة المنتج بنجاح يا وحش!");
            setName(''); setPrice(''); setImage('');
        })
        .catch(() => alert("فشل الاتصال بالسيرفر!"));
    };

    // إذا لم يدخل الكود الصحيح، أظهر له خانة "الدخول" فقط
    if (!isAuthorized) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h3>لوحة تحكم المدير فقط</h3>
                <input 
                    type="password" 
                    placeholder="أدخل الكود السري للدخول" 
                    onChange={(e) => setSecretCode(e.target.value)}
                    style={{ padding: '10px', marginBottom: '10px' }}
                /><br/>
                <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>دخول</button>
            </div>
        );
    }

    // إذا أدخل الكود صح، تظهر له الفورم الأصلية
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>أهلاً بك يا مدير - إضافة بضاعة جديدة</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', margin: '0 auto' }}>
                <input type="text" placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="text" placeholder="رابط الصورة" value={image} onChange={(e) => setImage(e.target.value)} required />
                <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>أضف للمحل ✅</button>
            </form>
        </div>
    );
}

export default Admin;
