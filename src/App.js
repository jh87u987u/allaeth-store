import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  
  // حالات لوحة التحكم (Admin States)
  const [isManager, setIsManager] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');

  const SERVER_URL = 'https://allaeth-store-1.onrender.com/api/products';

  // 1. جلب المنتجات عند تشغيل الصفحة
  useEffect(() => {
    fetch(SERVER_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("السيرفر مو شغال:", err));
  }, []);

  // 2. وظيفة إضافة منتج
  const handleAddProduct = (e) => {
    e.preventDefault();
    const productData = { name: newName, price: Number(newPrice), image: newImage };

    fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
      .then(res => res.json())
      .then(addedProduct => {
        setProducts([...products, addedProduct]);
        setNewName(''); setNewPrice(''); setNewImage('');
        alert("🔥 تمت الإضافة بنجاح يا وحش!");
      })
      .catch(err => alert("فشل في الإضافة!"));
  };

  // 3. وظيفة حذف منتج
  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      fetch(`${SERVER_URL}/${id}`, { method: 'DELETE' })
        .then(() => {
          setProducts(products.filter(p => p.id !== id));
        })
        .catch(err => alert("فشل الحذف!"));
    }
  };

  // 4. وظيفة تعديل السعر
  const handleEditPrice = (id) => {
    const newPriceValue = prompt("أدخل السعر الجديد:");
    if (newPriceValue) {
      fetch(`${SERVER_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPrice: Number(newPriceValue) }),
      })
        .then(res => res.json())
        .then(updatedProduct => {
          setProducts(products.map(p => (p.id === id ? updatedProduct : p)));
        })
        .catch(err => alert("فشل التعديل!"));
    }
  };

  const addToCart = (product) => setCart([...cart, product]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Arial', direction: 'rtl', padding: '20px', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🏪 محل الليث ستور</h1>
        <input
          type="text"
          placeholder="بحث عن منتج..."
          style={{ padding: '10px', width: '300px', borderRadius: '20px', border: '1px solid #ddd' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* زر دخول الإدارة */}
        {!isManager && (
          <button 
            onClick={() => {
              const p = prompt("أدخل كود المدير:");
              if(p === "allaeth123") setIsManager(true);
            }}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          >🔐</button>
        )}
      </header>

      {/* لوحة التحكم للمدير فقط */}
      {isManager && (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '2px solid #2980b9' }}>
          <h3>🛠️ لوحة تحكم المدير</h3>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="اسم المنتج" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            <input type="number" placeholder="السعر" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
            <input type="text" placeholder="رابط الصورة" value={newImage} onChange={(e) => setNewImage(e.target.value)} required />
            <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>أضف المنتج</button>
            <button onClick={() => setIsManager(false)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>خروج</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', width: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
            <h4>{product.name}</h4>
            <p style={{ color: '#27ae60', fontWeight: 'bold' }}>{product.price} ليرة</p>
            <button onClick={() => addToCart(product)} style={{ width: '100%', padding: '8px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>أضف للسلة 🛒</button>
            
            {/* أزرار الإدارة تحت كل منتج */}
            {isManager && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                <button onClick={() => handleEditPrice(product.id)} style={{ flex: 1, fontSize: '12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>تعديل</button>
                <button onClick={() => handleDelete(product.id)} style={{ flex: 1, fontSize: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>حذف</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
