import React, { useState } from 'react';

function Admin() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [adminPassword, setAdminPassword] = useState(''); // حالة كلمة السر
    const [isAdmin, setIsAdmin] = useState(false); // هل أنت المدير؟

    const secretKey = "allaeth123"; // اغير هذا الكود السري الخاص بك

    const checkAdmin = () => {
        if (adminPassword === secretKey) {
            setIsAdmin(true);
        } else {
            alert("كود خاطئ! أنت لست المدير.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // كود الـ fetch اللي كتبناه سابقاً يوضع هنا
    };

    // إذا لم يتأكد النظام أنك المدير، أظهر له خانة الكود فقط
    if (!isAdmin) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h2>دخول الإدارة</h2>
                <input 
                    type="password" 
                    placeholder="أدخل الكود السري" 
                    onChange={(e) => setAdminPassword(e.target.value)}
                />
                <button onClick={checkAdmin}>دخول</button>
            </div>
        );
    }

    // إذا كان المدير، تظهر له اللوحة الأصلية
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>لوحة تحكم المدير (إضافة بضاعة جديدة)</h2>
            {/* كود الفورم الأصلي تبعك هنا */}
        </div>
    );
}