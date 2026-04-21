import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const colors = {
    primary: '#2563eb',
    background: '#f8fafc',
    text: '#0f172a',
    border: '#e2e8f0',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
  };

  const fetchCart = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await axios.get(`http://localhost:3000/api/cart/${user.id}`);
      setCartItems(res.data);
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems.length) setSelectedIds([]);
    else setSelectedIds(cartItems.map(item => item.CartItemID));
  };

  const updateQuantity = async (cartItemId, newQty, stock) => {
    if (newQty < 1) {
      return removeItem(cartItemId); 
    }
    
    if (stock !== undefined && newQty > stock) {
      setToast(`⚠️ Chỉ còn ${stock} sản phẩm trong kho!`);
      setTimeout(() => setToast(''), 2000);
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/cart/update/${cartItemId}`, { quantity: newQty });
      setCartItems(prev => prev.map(item => 
        item.CartItemID === cartItemId ? { ...item, Quantity: newQty } : item
      ));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) { 
      setToast('❌ Lỗi cập nhật số lượng'); 
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/remove/${cartItemId}`);
      fetchCart();
      setSelectedIds(prev => prev.filter(id => id !== cartItemId));
      window.dispatchEvent(new Event('cartUpdated'));
      setToast('🗑️ Đã xóa sản phẩm');
      setTimeout(() => setToast(''), 2000);
    } catch (e) { 
        setToast('❌ Lỗi khi xóa'); 
    }
  };

  const selectedItems = cartItems.filter(item => selectedIds.includes(item.CartItemID));
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.Price * item.Quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: colors.background, fontFamily: '"Segoe UI", sans-serif' }}>
      <Header />
      {toast && <div style={{ position: 'fixed', top: '90px', right: '20px', backgroundColor: '#1e293b', color: 'white', padding: '14px 24px', borderRadius: '12px', zIndex: 2000 }}>{toast}</div>}

      <div style={{ flex: 1, padding: '40px 5% 100px 5%', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px', textAlign: 'center' }}>Giỏ hàng của bạn</h2>

        {cartItems.length > 0 && (
          <div style={{ backgroundColor: 'white', padding: '15px 25px', borderRadius: '15px', border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <input 
              type="checkbox" 
              checked={selectedIds.length === cartItems.length && cartItems.length > 0} 
              onChange={toggleSelectAll}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: '700' }}>Chọn tất cả ({cartItems.length} sản phẩm)</span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '32px' }}>
            <p style={{marginBottom: '20px', fontWeight: 'bold', color: '#64748b'}}>Giỏ hàng của bạn hiện đang trống!</p>
            <button onClick={() => navigate('/shop')} style={{ padding: '12px 30px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Tiếp tục mua sắm</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '30px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cartItems.map((item) => (
                <div key={item.CartItemID} style={{ display: 'flex', backgroundColor: 'white', padding: '20px', borderRadius: '20px', alignItems: 'center', gap: '20px', border: `1px solid ${colors.border}` }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(item.CartItemID)} 
                    onChange={() => toggleSelect(item.CartItemID)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  
                  {/* PHẦN HIỂN THỊ ẢNH ĐÃ FIX URL */}
                  <img 
                    src={item.Image?.startsWith('http') ? item.Image : `http://localhost:3000${item.Image}`} 
                    style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} 
                    onError={(e) => { e.target.src = 'https://placehold.co/100x120?text=No+Image'; }}
                    alt={item.ProductName}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{item.ProductName}</h4>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>Size: <b>{item.SizeName}</b></p>
                    <p style={{ fontWeight: '800', fontSize: '18px', marginTop: '10px', color: colors.primary }}>{Number(item.Price).toLocaleString()} đ</p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '5px', borderRadius: '10px', border: `1px solid ${colors.border}` }}>
                      <button onClick={() => updateQuantity(item.CartItemID, item.Quantity - 1, item.Stock)} style={{ width: '30px', height: '30px', border: 'none', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                      <span style={{ fontWeight: '800', width: '20px' }}>{item.Quantity}</span>
                      <button onClick={() => updateQuantity(item.CartItemID, item.Quantity + 1, item.Stock)} style={{ width: '30px', height: '30px', border: 'none', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginTop: '5px' }}>Kho: {item.Stock ?? '...'}</span>
                  </div>

                  <button 
                    onClick={() => removeItem(item.CartItemID)} 
                    style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#fff1f2', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '15px' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '25px', border: `1px solid ${colors.border}`, textAlign: 'center', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '25px', fontWeight: 'bold' }}>Tóm tắt đơn hàng</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ color: '#64748b' }}>Tạm tính:</span>
                <span>{totalPrice.toLocaleString()} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ color: '#64748b' }}>Phí vận chuyển:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Miễn phí</span>
              </div>
              <div style={{ height: '1px', backgroundColor: colors.border, margin: '20px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <span style={{ fontWeight: '800', fontSize: '18px' }}>Tổng cộng:</span>
                <span style={{ fontWeight: '900', fontSize: '26px', color: colors.primary }}>{totalPrice.toLocaleString()} đ</span>
              </div>
              <button 
                disabled={selectedIds.length === 0}
                onClick={() => navigate('/checkout', { state: { selectedItems, totalPrice } })}
                style={{ width: '100%', padding: '18px', backgroundColor: selectedIds.length === 0 ? '#cbd5e1' : colors.primary, color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}