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

  const API_URL = 'https://allaeth-store-1.onrender.com/api/products';

  // --- 2. جلب المنتجات عند تشغيل الصفحة ---
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("السيرفر مو شغال:", err));
  }, []);

  // --- 3. وظائف لوحة التحكم (إضافة، حذف، تعديل) ---
  
  // دالة الإضافة الجديدة باستخدام FormData لرفع الصورة
  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('price', newPrice);
    formData.append('image', document.getElementById('fileInput').files[0]);

    fetch(API_URL, {
        method: 'POST',
        body: formData // يتم إرسال الملف والبيانات هنا (بدون headers يدوية)
    })
    .then(res => res.json())
    .then(addedProduct => {
        setProducts([...products, addedProduct]); 
        setNewName(''); setNewPrice('');
        document.getElementById('fileInput').value = ""; // تنظيف خانة الملف
        alert("تمت الإضافة بنجاح يا وحش! 🔥");
    })
    .catch(err => alert("فشل الاتصال بالسيرفر!"));
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => {
          setProducts(products.filter(p => p.id !== id));
          alert("تم الحذف 🗑️");
        })
        .catch(err => alert("فشل الحذف!"));
    }
  };

  const handleEditPrice = (id) => {
    const pPrice = prompt("أدخل السعر الجديد:");
    if (pPrice) {
      fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPrice: Number(pPrice) })
      })
        .then(res => res.json())
        .then(updatedProduct => {
          setProducts(products.map(p => p.id === id ? updatedProduct : p));
          alert("تم التعديل ✅");
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
      
      <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>🛒 متجر Allaeth</h1>
        <input 
          type="text" 
          placeholder="دور على غرضك..." 
          style={{ padding: '10px', width: '300px', borderRadius: '20px', border: 'none' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

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
        <div style={{ backgroundColor: '#fff', padding: '20px', margin: '20px auto', borderRadius: '15px', maxWidth: '800px' }}>
          <h3 style={{ color: '#2980b9' }}>🛠️ إضافة بضاعة جديدة (لوحة المدير)</h3>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="اسم المنتج" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            <input type="number" placeholder="السعر" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
            
            {/* التعديل هنا: استخدام file بدل text لاختيار صورة من الجهاز */}
            <input type="file" id="fileInput" accept="image/*" required />
            
            <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
              أضف للمحل ✅
            </button>
            <button onClick={() => setIsManager(false)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px' }}>خروج</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', padding: '20px', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 3, display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={cardStyle}>
              {/* تعديل مسار الصورة ليدعم الصور المرفوعة (لو كانت مخزنة في مجلد uploads بالسيرفر) */}
              <img 
                src={product.image.startsWith('http') ? product.image : `https://allaeth-store-1.onrender.com${product.image}`} 
                alt={product.name} 
                style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
              />
              <h3>{product.name}</h3>
              <p style={{ color: '#27ae60', fontWeight: 'bold' }}>{product.price} ليرة</p>
              <button onClick={() => addToCart(product)} style={btnStyle}>عبي بلسلة</button>
              
              {isManager && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleEditPrice(product.id)} style={{ flex: 1, backgroundColor: 'orange', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>تعديل</button>
                  <button onClick={() => handleDelete(product.id)} style={{ flex: 1, backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>حذف</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: '250px', backgroundColor: 'white', padding: '15px', borderRadius: '10px', height: 'fit-content' }}>
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

const cardStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '10px', width: '200px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const btnStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', width: '100%' };

export default App;
