import React, { useState, useEffect } from 'react';

function App() {
  // --- 1. الحالات (States) ---
  const [isManager, setIsManager] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  // حالات لوحة التحكم (Admin States)
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');

  const API_URL = 'https://allaeth-store-1.onrender.com/api/products';

  // --- 2. جلب المنتجات عند تشغيل الصفحة ---
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("السيرفر مو شغال:", err));
  }, []);

  // --- 3. وظائف لوحة التحكم (إضافة، حذف، تعديل) ---
  
  // إضافة منتج
  const handleAddProduct = (e) => {
    e.preventDefault();
    const productData = { name: newName, price: Number(newPrice), image: newImage };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
      .then(res => res.json())
      .then(addedProduct => {
        setProducts([...products, addedProduct]);
        setNewName(''); setNewPrice(''); setNewImage('');
        alert("تمت الإضافة بنجاح يا وحش! 🔥");
      })
      .catch(err => alert("فشل الاتصال بالسيرفر!"));
  };

  // حذف منتج
  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => {
          setProducts(products.filter(p => p.id !== id));
          alert("تم الحذف بنجاح 🗑️");
        })
        .catch(err => alert("فشل الحذف!"));
    }
  };

  // تعديل السعر
  const handleEditPrice = (id) => {
    const pricePrompt = prompt("أدخل السعر الجديد:");
    if (pricePrompt) {
      fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPrice: Number(pricePrompt) })
      })
        .then(res => res.json())
        .then(updatedProduct => {
          setProducts(products.map(p => p.id === id ? updatedProduct : p));
          alert("تم تحديث السعر ✅");
        })
        .catch(err => alert("فشل التعديل!"));
    }
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

      {/* لوحة التحكم المحمية */}
      {!isManager ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <button 
            onClick={() => {
              const pass = prompt("أدخل كود المدير:");
              if (pass === "allaeth123") setIsManager(true);
              else alert("كود خطأ!");
            }}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            دخول لوحة الإدارة 🔐
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', padding: '20px', margin: '20px auto', borderRadius: '15px', maxWidth: '800px', border: '2px solid #2980b9' }}>
          <h3 style={{ color: '#2980b9' }}>🛠️ لوحة تحكم المدير (إضافة بضاعة)</h3>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input style={inputStyle} type="text" placeholder="اسم المنتج" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            <input style={inputStyle} type="number" placeholder="السعر" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
            <input style={inputStyle} type="text" placeholder="رابط الصورة" value={newImage} onChange={(e) => setNewImage(e.target.value)} required />
            <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
              أضف للمحل ✅
            </button>
            <button onClick={() => setIsManager(false)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>خروج</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', padding: '20px', gap: '20px', flexWrap: 'wrap' }}>
        {/* عرض المنتجات */}
        <div style={{ flex: 3, display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={cardStyle}>
              <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
              <h3>{product.name}</h3>
              <p style={{ color: '#27ae60', fontWeight: 'bold' }}>{product.price} ليرة</p>
              <button onClick={() => addToCart(product)} style={btnStyle}>عبي بالسلة 🛒</button>
              
              {/* أزرار المدير تظهر فقط عند تسجيل الدخول */}
              {isManager && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleEditPrice(product.id)} style={{ flex: 1, backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer' }}>تعديل ✏️</button>
                  <button onClick={() => handleDelete(product.id)} style={{ flex: 1, backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer' }}>حذف 🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* السلة */}
        <div style={{ flex: 1, minWidth: '250px', backgroundColor: 'white', padding: '15px', borderRadius: '10px', height: 'fit-content', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2>🛒 السلة ({cart.length})</h2>
          {cart.length === 0 ? <p>السلة فاضية..</p> : (
            cart.map((item, index) => (
              <div key={index} style={{ borderBottom: '1px solid #eee', padding: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.name} - {item.price} ليرة</span>
                <button onClick={() => removeFromCart(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>
            ))
          )}
          <hr />
          <h3>الإجمالي: {totalPrice} ليرة</h3>
          <button style={{ ...btnStyle, backgroundColor: '#27ae60' }} onClick={() => alert('قريباً سيتم تفعيل الدفع!')}>تأكيد الطلب ✅</button>
        </div>
      </div>
    </div>
  );
}

// تنسيقات
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', flex: '1', minWidth: '150px' };
const cardStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '10px', width: '220px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const btnStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', width: '100%', marginTop: '5px' };

export default App;
