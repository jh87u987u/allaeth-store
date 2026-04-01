import React, { useState } from 'react';

function Admin() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = { name, price: Number(price), image };

        fetch('https://allaeth-store-1.onrender.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        })
        .then(() => {
            alert("تمت إضافة المنتج بنجاح يا وحش!");
            setName(''); setPrice(''); setImage('');
        });
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>إضافة منتج جديد للمحل 🛒</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', margin: '0 auto' }}>
                <input type="text" placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="text" placeholder="رابط الصورة" value={image} onChange={(e) => setImage(e.target.value)} />
                <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px' }}>أضف المنتج</button>
            </form>
        </div>
    );
}

export default Admin;