import React, { useState, useEffect } from 'react';

function App() {
  // --- 1. الحالات (States) ---
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  // حالات لوحة التحكم (Admin States)
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');

  // --- 2. جلب المنتجات عند تشغيل الصفحة ---
  useEffect(() => {
    fetch('https://allaeth-store-1.onrender.com/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("السيرفر مو شغال:", err));
  }, []);

  // --- 3. وظائف لوحة التحكم (إضافة منتج) ---
  const handleAddProduct = (e) => {
    e.preventDefault();
    const productData = { name: newName, price: Number(newPrice), image: newImage };

    fetch('http:calhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
      .then(res => res.json())
      .then(addedProduct => {
        setProducts([...products, addedProduct]); // تحديث القائمة فوراً
        setNewName(''); setNewPrice(''); setNewImage(''); // تنظيف الخانات
        alert("تمت الإضافة بنجاح يا وحش! 🔥");
      })
      .catch(err => alert("فشل الاتصال بالسيرفر!"));
  };

  // --- 4. وظائف السلة والبحث ---
  const addToCart = (product) => setCart([...cart, product]);
  
  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  // --- 5. واجهة المستخدم (UI) ---
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      
      {/* الهيدر */}
      <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>🛒 متجر Allaeth المطور</h1>
        <input 
          type="text" 
          placeholder="دور على غرضك..." 
          style={{ padding: '10px', width: '300px', borderRadius: '20px', border: 'none' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {/* لوحة التحكم (Admin Section) */}
      <div style={{ backgroundColor: '#fff', padding: '20px', margin: '20px auto', borderRadius: '15px', maxWidth: '800px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2980b9' }}>🛠️ لوحة تحكم المدير (إضافة بضاعة جديدة)</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="اسم المنتج" value={newName} onChange={e => setNewName(e.target.value)} required style={inputStyle} />
          <input type="number" placeholder="السعر" value={newPrice} onChange={e => setNewPrice(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="رابط الصورة" value={newImage} onChange={e => setNewImage(e.target.value)} style={inputStyle} />
          <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
            أضف للمحل ✅
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
        {/* عرض المنتجات */}
        <div style={{ flex: 3, display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={cardStyle}>
              <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <h3>{product.name}</h3>
              <p style={{ color: '#27ae60', fontWeight: 'bold' }}>{product.price} ليرة</p>
              <button onClick={() => addToCart(product)} style={btnStyle}>عبي بلسلة</button>
            </div>
          ))}
        </div>

        {/* السلة */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '15px', borderRadius: '10px', height: 'fit-content' }}>
          <h2>🛒 السلة ({cart.length})</h2>
          {cart.map((item, index) => (
            <div key={index} style={{ borderBottom: '1px solid #eee', padding: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}</span>
              <button onClick={() => removeFromCart(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>حذف</button>
            </div>
          ))}
          <h3>الإجمالي: {totalPrice} ليرة</h3>
        </div>
      </div>
    </div>
  );
}

// تنسيقات بسيطة
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', flex: '1' };
const cardStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '10px', width: '200px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const btnStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', width: '100%' };

export default App;
