import React, { useState, useEffect } from 'react';

function App() {
  const [isManager, setIsManager] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // حفظ السلة في الجهاز
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('allaeth_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // حالات الإضافة (للمدير)
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('ملابس');

  const API_URL = 'https://allaeth-store-1.onrender.com/api/products';
  const categories = ['الكل', 'ملابس', 'إلكترونيات', 'عطور', 'أحذية', 'عام'];

  useEffect(() => {
    localStorage.setItem('allaeth_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(data => setProducts(data));
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('price', newPrice);
    formData.append('category', newCategory);
    formData.append('image', document.getElementById('fileInput').files[0]);

    fetch(API_URL, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(added => {
        setProducts([...products, added]);
        setNewName(''); setNewPrice('');
        alert("تمت الإضافة بنجاح 🔥");
      });
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

  const applyPromo = () => {
    if (promoCode === 'ALLAETH10') {
      setDiscount(0.10);
      alert("تم تفعيل خصم 10% ✅");
    } else {
      alert("كود غير صحيح ❌");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const finalPrice = totalPrice - (totalPrice * discount);

  const sendOrder = () => {
    const items = cart.map(i => `- ${i.name} (${i.price} ليرة)`).join('%0A');
    const msg = `طلب جديد:%0A${items}%0Aالإجمالي: ${finalPrice} ليرة`;
    window.open(`https://wa.me/9627XXXXXXXX?text=${msg}`); // استبدل X برقمك
  };

  return (
    <div style={{ fontFamily: 'Arial', direction: 'rtl', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Header */}
      <header style={headerStyle}>
        <div style={topBar}>
          <h2 style={{color: '#42b72a'}}>Allaeth Store</h2>
          <input type="text" placeholder="بحث..." style={searchStyle} onChange={e => setSearchTerm(e.target.value)} />
          <button 
            onClick={() => {
              if(!isManager) {
                if(prompt("كود المدير:") === "allaeth123") setIsManager(true);
                else alert("خطأ!");
              } else setIsManager(false);
            }} 
            style={adminBtn}
          >
            {isManager ? "خروج" : "🔒 الإدارة"}
          </button>
        </div>
        <div style={catBar}>
          {categories.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)} style={{...catBtn, backgroundColor: selectedCategory === c ? '#42b72a' : '#3a3b3c'}}>
              {c}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: 'flex', gap: '20px', padding: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* قائمة المنتجات */}
        <div style={{ flex: 3, display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {products.filter(p => (selectedCategory === 'الكل' || p.category === selectedCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <div key={p.id} style={cardStyle}>
              <div style={badgeStyle}>{p.category}</div>
              <img src={p.image.startsWith('http') ? p.image : `https://allaeth-store-1.onrender.com${p.image}`} style={imgStyle} alt="" />
              <h4>{p.name}</h4>
              <div style={{color: '#f1c40f'}}>★★★★★</div>
              <p style={{color: '#42b72a', fontWeight: 'bold'}}>{p.price} ليرة</p>
              <button onClick={() => setCart([...cart, p])} style={addBtnStyle}>أضف للسلة 🛒</button>
              
              {isManager && (
                <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                  <button onClick={() => handleEditPrice(p.id)} style={editBtn}>تعديل</button>
                  <button onClick={() => handleDelete(p.id)} style={delBtn}>حذف</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* السلة */}
        <div style={cartContainer}>
          <h3>🛒 السلة ({cart.length})</h3>
          {cart.map((item, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee', padding:'5px 0'}}>
              <span>{item.name}</span>
              <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} style={{border:'none', color:'red', cursor:'pointer'}}>❌</button>
            </div>
          ))}
          <div style={{marginTop:'15px'}}>
            <input placeholder="كود الخصم" style={{width:'60%', padding:'5px'}} onChange={e=>setPromoCode(e.target.value)} />
            <button onClick={applyPromo} style={{width:'35%', padding:'5px'}}>خصم</button>
            <p>الإجمالي الصافي: <b>{finalPrice} ليرة</b></p>
            <button onClick={sendOrder} style={waBtn}>طلب عبر واتساب ✅</button>
          </div>
        </div>
      </div>

      {/* لوحة الإضافة للمدير */}
      {isManager && (
        <div style={adminBox}>
          <h3>🛠️ إضافة منتج</h3>
          <form onSubmit={handleAddProduct} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <input placeholder="اسم المنتج" value={newName} onChange={e=>setNewName(e.target.value)} required />
            <input placeholder="السعر" type="number" value={newPrice} onChange={e=>setNewPrice(e.target.value)} required />
            <select value={newCategory} onChange={e=>setNewCategory(e.target.value)}>
              {categories.filter(c=>c!=='الكل').map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <input type="file" id="fileInput" accept="image/*" required />
            <button type="submit" style={{backgroundColor:'#42b72a', color:'white', border:'none', padding:'10px', borderRadius:'5px'}}>حفظ</button>
          </form>
        </div>
      )}
    </div>
  );
}

// التنسيقات (Styles)
const headerStyle = { backgroundColor: '#1c1e21', padding: '15px', color: 'white', position: 'sticky', top: 0, zIndex: 100 };
const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '10px' };
const searchStyle = { flex: 1, padding: '8px 15px', borderRadius: '20px', border: 'none' };
const adminBtn = { backgroundColor: '#3a3b3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' };
const catBar = { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' };
const catBtn = { color: 'white', border: 'none', padding: '5px 12px', borderRadius: '15px', cursor: 'pointer' };
const cardStyle = { width: '200px', backgroundColor: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'relative' };
const badgeStyle = { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#42b72a', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' };
const imgStyle = { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' };
const addBtnStyle = { width: '100%', backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' };
const cartContainer = { width: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', height: 'fit-content', position: 'sticky', top: '130px' };
const waBtn = { width: '100%', backgroundColor: '#25D366', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const adminBox = { position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 0 15px rgba(0,0,0,0.2)', zIndex: 1000 };
const editBtn = { flex: 1, backgroundColor: '#eee', border: 'none', padding: '5px', borderRadius: '5px', cursor: 'pointer' };
const delBtn = { flex: 1, backgroundColor: '#f02849', color: 'white', border: 'none', padding: '5px', borderRadius: '5px', cursor: 'pointer' };

export default App;
