import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ CategoryID: 0, CategoryName: 'Tất cả' }]); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  
  const [activeCategoryId, setActiveCategoryId] = useState(0); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  // --- STATE MODAL CHỌN SIZE & SỐ LƯỢNG ---
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [productSizes, setProductSizes] = useState([]); 
  const [selectedSize, setSelectedSize] = useState(null); 
  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState(''); 

  const colors = { 
    primary: '#2563eb', 
    primaryHover: '#1d4ed8', 
    background: '#f8fafc', 
    text: '#0f172a', 
    textLight: '#475569', 
    border: '#e2e8f0', 
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resCategories] = await Promise.all([ 
          axios.get('http://localhost:3000/api/products'), 
          axios.get('http://localhost:3000/api/categories') 
        ]);
        setProducts(resProducts.data); 
        setCategories([{ CategoryID: 0, CategoryName: 'Tất cả' }, ...resCategories.data]); 
        setLoading(false);
      } catch (error) { setLoading(false); }
    };
    fetchData();
  }, []);

  const openModal = async (product, type) => {
    if (!user) { 
      setToast('⚠️ Vui lòng đăng nhập!'); 
      setTimeout(() => navigate('/login'), 1500); 
      return; 
    }
    setSelectedProduct(product); 
    setActionType(type); 
    setQuantity(1); 
    setSelectedSize(null); 
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${product.ProductID}/sizes`);
      setProductSizes(response.data);
      const firstAvailableSize = response.data.find(s => s.Stock > 0);
      if(firstAvailableSize) setSelectedSize(firstAvailableSize); 
    } catch (error) { setToast('❌ Lỗi tải kích thước!'); }
  };

  const handleConfirmAction = async () => {
    if (!selectedSize) return setToast('⚠️ Vui lòng chọn size!');
    try {
      await axios.post('http://localhost:3000/api/cart/add', { 
        UserID: user.id, ProductID: selectedProduct.ProductID, 
        SizeID: selectedSize.SizeID, Quantity: quantity 
      });
      window.dispatchEvent(new Event('cartUpdated'));
      setToast(`✨ Đã thêm vào giỏ!`);
      const type = actionType;
      setSelectedProduct(null);
      if (type === 'buy') setTimeout(() => navigate('/cart'), 800); 
    } catch (error) { setToast('❌ Lỗi khi thêm!'); }
  };

  const filteredProducts = products.filter(p => 
    (activeCategoryId === 0 || p.CategoryID === activeCategoryId) && 
    p.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: '"Segoe UI", sans-serif' }}>
      <Header />

      {toast && (
        <div style={{ position: 'fixed', top: '90px', right: '20px', backgroundColor: '#1e293b', color: 'white', padding: '14px 24px', borderRadius: '12px', zIndex: 9999, boxShadow: colors.shadow }}>
          {toast}
        </div>
      )}

      <div style={{ padding: '50px 5% 100px 5%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* THANH FILTER & SEARCH */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '20px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, borderRadius: '8px', backgroundColor: 'white' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', backgroundColor: 'white', padding: '5px', borderRadius: '15px', border: `1px solid ${colors.border}` }}>
              {(isExpanded ? categories : categories.slice(0, 4)).map(cat => (
                <button 
                  key={cat.CategoryID} 
                  onClick={() => setActiveCategoryId(cat.CategoryID)} 
                  style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', backgroundColor: activeCategoryId === cat.CategoryID ? colors.primary : 'transparent', color: activeCategoryId === cat.CategoryID ? 'white' : colors.textLight }}
                >
                  {cat.CategoryName}
                </button>
              ))}
              <button onClick={() => setIsExpanded(!isExpanded)} style={{ padding: '8px 20px', borderRadius: '20px', border: `1px dashed ${colors.primary}`, color: colors.primary, cursor: 'pointer', fontWeight: '600' }}>
                {isExpanded ? 'Thu gọn ↑' : 'Xem thêm ↓'}
              </button>
            </div>
          </div>
          <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '10px 20px', borderRadius: '30px', border: `1px solid ${colors.border}`, width: '300px', outline: 'none' }} />
        </div>

        {/* LƯỚI SẢN PHẨM CÓ HOVER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {filteredProducts.map((product) => (
            <div key={product.ProductID} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '15px', boxShadow: colors.shadow, transition: 'transform 0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <img src={product.Image} alt={product.ProductName} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }} />
              <div style={{ padding: '15px 5px' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{product.ProductName}</h3>
                <p style={{ fontWeight: '900', fontSize: '22px', marginBottom: '15px' }}>{Number(product.Price).toLocaleString()} đ</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => openModal(product, 'add')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', backgroundColor: '#eff6ff', color: colors.primary, fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => {e.target.style.backgroundColor=colors.primary; e.target.style.color='white'}} onMouseOut={(e) => {e.target.style.backgroundColor='#eff6ff'; e.target.style.color=colors.primary}}>Thêm</button>
                  <button onClick={() => openModal(product, 'buy')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', backgroundColor: colors.primary, color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor=colors.primaryHover} onMouseOut={(e) => e.target.style.backgroundColor=colors.primary}>Mua ngay</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL CHỌN SIZE & SỐ LƯỢNG (KHÔI PHỤC CHUẨN ẢNH) --- */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '32px', width: '450px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>{selectedProduct.ProductName}</h2>
            <p style={{ color: colors.primary, fontWeight: '900', fontSize: '26px', marginBottom: '30px' }}>{Number(selectedProduct.Price).toLocaleString()} đ</p>
            
            <p style={{ fontWeight: '800', marginBottom: '15px', fontSize: '15px' }}>Chọn Size:</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', justifyContent: 'center' }}>
              {productSizes.map((s) => (
                <button key={s.SizeID} disabled={s.Stock === 0} onClick={() => setSelectedSize(s)}
                  style={{ width: '60px', height: '45px', borderRadius: '12px', cursor: s.Stock === 0 ? 'not-allowed' : 'pointer', border: selectedSize?.SizeID === s.SizeID ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, backgroundColor: selectedSize?.SizeID === s.SizeID ? '#eff6ff' : 'white', fontWeight: 'bold' }}>
                  {s.SizeName}
                </button>
              ))}
            </div>

            <p style={{ fontWeight: '800', marginBottom: '15px', fontSize: '15px' }}>Số lượng:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '40px', borderRadius: '10px', border: `1px solid ${colors.border}`, background: 'white', fontSize: '20px', cursor: 'pointer' }}>-</button>
              <span style={{ fontSize: '22px', fontWeight: '900', width: '30px' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: `1px solid ${colors.border}`, background: 'white', fontSize: '20px', cursor: 'pointer' }}>+</button>
              {selectedSize && <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '10px' }}>Kho: {selectedSize.Stock}</span>}
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#f1f5f9', fontWeight: 'bold', cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleConfirmAction} style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: colors.primary, color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}