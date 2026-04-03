import React, { useState, useEffect } from 'react';

function App() {
  const [isManager, setIsManager] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  
  // 1. نظام حفظ السلة (LocalStorage)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('allaeth_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('allaeth_cart', JSON.stringify(cart));
  }, [cart]);

  // حالات الإدارة
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('ملابس');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const API_URL = 'https://allaeth-store-1.onrender.com/api/products';
  const categories = ['الكل', 'ملابس', 'إلكترونيات', 'عطور', 'أحذية', 'عام'];

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

  // ميزة كود الخصم
  const applyPromo = () => {
    if (promoCode === 'ALLAETH10') {
      setDiscount(0.10); // خصم 10%
      alert("تم تفعيل خصم 10% 🎊");
    } else {
      alert("كود خطأ!");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const finalPrice = totalPrice - (totalPrice * discount);

  // إرسال السلة كاملة للواتساب
  const sendFullOrder = () => {
    const itemsList = cart.map(item => `- ${item.name} (${item.price} ليرة)`).join('%0A');
    const message = `طلب جديد من المتجر:%0A${itemsList}%0A%0Aالإجمالي بعد الخصم: ${finalPrice} ليرة`;
    window.open(`https://wa.me/9627XXXXXXXX?text=${message}`);
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma', direction: 'rtl', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Header */}
      <header style={headerStyle}>
        <div style={topBar}>
          <h1 style={{ color: '#42b72a', margin: 0 }}>Allaeth Store</h1>
          <input type="text" placeholder="ابحث هنا..." style={searchStyle} onChange={e => setSearchTerm(e.target.value)} />
          <button onClick={() => setIsManager(!isManager)} style={adminToggle}>🔒 الإدارة</button>
        </div>
        <div style={catBarStyle}>
          {categories.map(c => (
            <span key={c} onClick={() => setSelectedCategory(c)} style={{...catItem, backgroundColor: selectedCategory === c ? '#42b72a' : 'transparent'}}>
              {c}
            </span>
          ))}
        </div>
      </header>

      <div style={mainLayout}>
        {/* المنتجات */}
        <div style={productsGrid}>
          {products.filter(p => (selectedCategory === 'الكل' || p.category === selectedCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <div key={p.id} style={cardStyle}>
              <div style={badge}>{p.category}</div>
              <img src={p.image.startsWith('http') ? p.image : `https://allaeth-store-1.onrender.com${p.image}`} style={imgStyle} alt="" />
              <h3 style={{margin:'10px 0 5px'}}>{p.name}</h3>
              <div style={{color:'#f1c40f', marginBottom: '5px'}}>{"★".repeat(p.rating || 5)}{"☆".repeat(5-(p.rating || 5))}</div>
              <p style={priceStyle}>{p.price} ليرة</p>
              <button onClick={() => setCart([...cart, p])} style={addBtn}>أضف للسلة 🛒</button>
            </div>
          ))}
        </div>

        {/* السلة الجانبية */}
        <div style={cartSidebar}>
          <h2 style={{borderBottom:'2px solid #42b72a', paddingBottom:'10px'}}>🛒 سلتك ({cart.length})</h2>
          {cart.map((item, i) => (
            <div key={i} style={cartItem}>
              <span>{item.name}</span>
              <b>{item.price} ليرة</b>
              <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} style={{border:'none', color:'red', background:'none', cursor:'pointer'}}>❌</button>
            </div>
          ))}
          
          <div style={{marginTop:'20px', padding:'10px', backgroundColor:'#f9f9f9', borderRadius:'8px'}}>
            <input placeholder="كود الخصم" value={promoCode} onChange={e=>setPromoCode(e.target.value)} style={promoInput} />
            <button onClick={applyPromo} style={promoBtn}>تفعيل</button>
            <hr/>
            <h4>الإجمالي: {totalPrice} ليرة</h4>
            <h3 style={{color:'#42b72a'}}>الصافي: {finalPrice} ليرة</h3>
            <button onClick={sendFullOrder} style={orderBtn} disabled={cart.length === 0}>إرسال الطلب عبر واتساب ✅</button>
          </div>
        </div>
      </div>

      {/* لوحة المدير تظهر كـ Modal أو قسم إضافي */}
      {isManager && (
        <div style={adminSection}>
            <h3>🛠️ إضافة منتج جديد</h3>
            <form onSubmit={handleAddProduct}>
                <input placeholder="الاسم" value={newName} onChange={e=>setNewName(e.target.value)} style={inputStyle} required />
                <input placeholder="السعر" type="number" value={newPrice} onChange={e=>setNewPrice(e.target.value)} style={inputStyle} required />
                <select value={newCategory} onChange={e=>setNewCategory(e.target.value)} style={inputStyle}>
                    {categories.filter(c=>c!=='الكل').map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <input type="file" id="fileInput" accept="image/*" required />
                <button type="submit" style={saveBtn}>حفظ المنتج</button>
            </form>
        </div>
      )}
    </div>
  );
}

// التنسيقات
const headerStyle = { backgroundColor: '#1c1e21', color: 'white', padding: '15px', position: 'sticky', top: 0, zIndex: 100 };
const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '15px' };
const searchStyle = { flex: 1, padding: '10px', borderRadius: '20px', border: 'none', maxWidth: '500px' };
const catBarStyle = { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' };
const catItem = { padding: '5px 15px', borderRadius: '15px', cursor: 'pointer', transition: '0.3s', fontSize: '14px', border: '1px solid #42b72a' };
const mainLayout = { display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' };
const productsGrid = { flex: 3, display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' };
const cardStyle = { width: '200px', backgroundColor: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'relative' };
const badge = { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#42b72a', color: 'white', fontSize: '10px', padding: '2px 7px', borderRadius: '5px' };
const imgStyle = { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' };
const priceStyle = { color: '#42b72a', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' };
const addBtn = { width: '100%', padding: '8px', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const cartSidebar = { flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', height: 'fit-content' };
const cartItem = { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' };
const promoInput = { width: '60%', padding: '5px', borderRadius: '5px 0 0 5px', border: '1px solid #ddd' };
const promoBtn = { width: '30%', padding: '5px', backgroundColor: '#1c1e21', color: 'white', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer' };
const orderBtn = { width: '100%', padding: '12px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' };
const adminSection = { position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.2)', zIndex: 1000 };
const inputStyle = { display: 'block', width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' };
const saveBtn = { width: '100%', padding: '10px', backgroundColor: '#42b72a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const adminToggle = { backgroundColor: '#3a3b3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' };

export default App;
