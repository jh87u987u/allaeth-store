import React, { useState, useEffect } from 'react';

function App() {
  const [isManager, setIsManager] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  
  // حالات الإدارة
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('ملابس'); // القسم الافتراضي

  const API_URL = 'https://allaeth-store-1.onrender.com/api/products';
  const categories = ['الكل', 'ملابس', 'إلكترونيات', 'عطور', 'أحذية', 'عام'];

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("السيرفر مو شغال:", err));
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('price', newPrice);
    formData.append('category', newCategory); // إرسال القسم المختارة
    const fileInput = document.getElementById('fileInput');
    formData.append('image', fileInput.files[0]);

    fetch(API_URL, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(addedProduct => {
        setProducts([...products, addedProduct]); 
        setNewName(''); setNewPrice(''); 
        fileInput.value = '';
        alert("تمت الإضافة بنجاح 🔥");
      })
      .catch(err => alert("فشل الاتصال!"));
  };

  const handleDelete = (id) => {
    if (window.confirm("حذف المنتج؟")) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => setProducts(products.filter(p => p.id !== id)));
    }
  };

  const handleEditPrice = (id) => {
    const pPrice = prompt("السعر الجديد:");
    if (pPrice) {
      fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPrice: Number(pPrice) })
      })
        .then(res => res.json())
        .then(updated => setProducts(products.map(p => p.id === id ? updated : p)));
    }
  };

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));

  // الفلترة حسب البحث وحسب القسم المختار
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', direction: 'rtl', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* القائمة العلوية الثابتة */}
      <header style={{ backgroundColor: '#1c1e21', color: 'white', padding: '10px 20px', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ margin: 0, color: '#42b72a' }}>🛒 Allaeth Store</h2>
          <input 
            type="text" 
            placeholder="ابحث عن منتج..." 
            style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', width: '40%' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ fontWeight: 'bold' }}>🛒 السلة: {cart.length}</div>
        </div>
        
        {/* شريط الأقسام */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '5px 15px', borderRadius: '15px', border: 'none', cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? '#42b72a' : '#3a3b3c',
                color: 'white', fontWeight: 'bold', transition: '0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* لوحة التحكم */}
      {!isManager ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <button onClick={() => { if(prompt("كود المدير:") === "allaeth123") setIsManager(true) }} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '5px' }}>دخول الإدارة 🔐</button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', padding: '20px', margin: '20px auto', borderRadius: '10px', maxWidth: '800px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1877f2', marginTop: 0 }}>🛠️ إضافة بضاعة جديدة</h3>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="text" placeholder="اسم المنتج" value={newName} onChange={(e) => setNewName(e.target.value)} required style={inputStyle} />
            <input type="number" placeholder="السعر" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required style={inputStyle} />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={inputStyle}>
              {categories.filter(c => c !== 'الكل').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="file" id="fileInput" accept="image/*" required />
            <button type="submit" style={{ backgroundColor: '#42b72a', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>إضافة ✅</button>
            <button onClick={() => setIsManager(false)} style={{ backgroundColor: '#f02849', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>خروج</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', padding: '20px', gap: '20px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ flex: 3, display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={cardStyle}>
              <div style={categoryBadge}>{product.category}</div>
              <img 
                src={product.image.startsWith('http') ? product.image : `https://allaeth-store-1.onrender.com${product.image}`} 
                alt={product.name} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <h3 style={{ margin: '10px 0 5px 0' }}>{product.name}</h3>
              <p style={{ color: '#42b72a', fontWeight: 'bold', fontSize: '1.1rem', margin: '5px 0' }}>{product.price} ليرة</p>
              
              <button onClick={() => addToCart(product)} style={btnStyle}>عبي بالسلة 🛒</button>
              
              {/* زر الواتساب المطور */}
              <button 
                onClick={() => window.open(`https://wa.me/963951432398?text=مرحباً، أرغب بطلب: ${product.name} بسعر ${product.price}`)}
                style={{ ...btnStyle, backgroundColor: '#25D366', marginTop: '5px' }}
              >
                طلب واتساب 💬
              </button>
              
              {isManager && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleEditPrice(product.id)} style={{ flex: 1, backgroundColor: '#e4e6eb', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px' }}>تعديل</button>
                  <button onClick={() => handleDelete(product.id)} style={{ flex: 1, backgroundColor: '#f02849', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px' }}>حذف</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* السلة الجانبية */}
        <div style={{ flex: 1, minWidth: '280px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', height: 'fit-content', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: '120px' }}>
          <h2 style={{ marginTop: 0 }}>🛒 طلباتك</h2>
          {cart.length === 0 ? <p>السلة فاضية.. عمي المحل!</p> : (
            <>
              {cart.map((item, index) => (
                <div key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.name}</span>
                  <button onClick={() => removeFromCart(index)} style={{ color: '#f02849', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>❌</button>
                </div>
              ))}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3 style={{ color: '#1c1e21' }}>الإجمالي: {totalPrice} ليرة</h3>
                <button style={{ width: '100%', padding: '12px', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>تأكيد الطلب ✅</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', outline: 'none' };
const cardStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '12px', width: '220px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s', position: 'relative' };
const categoryBadge = { position: 'absolute', top: '20px', left: '20px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '3px 10px', borderRadius: '10px', fontSize: '0.8rem' };
const btnStyle = { backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold' };

export default App;
