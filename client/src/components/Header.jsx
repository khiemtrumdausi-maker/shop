import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const colors = {
    primary: '#2563eb',
    text: '#0f172a',
    textLight: '#475569',
    border: '#e2e8f0',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  };

  const fetchCartCount = async () => {
    if (user) {
      try {
        const response = await axios.get(`http://localhost:3000/api/cart/count/${user.id}`);
        setCartCount(response.data.count || 0);
      } catch (error) {
        console.error('Lỗi lấy số lượng giỏ hàng:', error);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setShowUserMenu(false);
  };

  const navLinkStyle = { fontSize: '15.5px', fontWeight: '600', color: colors.textLight, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s' };
  const navLinkActiveStyle = { ...navLinkStyle, color: colors.primary };

  return (
    <nav style={{ backgroundColor: 'white', padding: '15px 5%', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, borderBottom: `1px solid ${colors.border}` }}>
      
      {/* LOGO */}
      <div style={{ justifySelf: 'start' }}>
        <h1 
          style={{ margin: 0, fontSize: '28px', color: colors.primary, fontWeight: '900', letterSpacing: '1px', whiteSpace: 'nowrap', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          CGK SHOP
        </h1>
      </div>
      
      {/* MENU ĐIỀU HƯỚNG */}
      <div style={{ display: 'flex', gap: '50px' }}>
        <span style={location.pathname === '/' ? navLinkActiveStyle : navLinkStyle} onClick={() => navigate('/')}>Home</span>
        <span style={location.pathname === '/shop' ? navLinkActiveStyle : navLinkStyle} onClick={() => navigate('/shop')}>Shop</span>
        <span style={location.pathname === '/about' ? navLinkActiveStyle : navLinkStyle} onClick={() => navigate('/about')}>About Us</span>
        <span style={location.pathname === '/contact' ? navLinkActiveStyle : navLinkStyle} onClick={() => navigate('/contact')}>Contact</span>
      </div>

      {/* ICON TIỆN ÍCH */}
      <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '25px', paddingLeft: '25px', borderLeft: `2px solid #f1f5f9` }}>
        
        {/* GIỎ HÀNG */}
        <div onClick={() => navigate('/cart')} style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={location.pathname === '/cart' ? colors.primary : colors.textLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: colors.primary, color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 'bold', border: '2px solid white' }}>
              {cartCount}
            </span>
          )}
        </div>
        
        {/* DROPDOWN USER (NƠI CHỨA LỊCH SỬ ĐƠN HÀNG) */}
        <div style={{ position: 'relative' }}>
          <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '38px', height: '38px', flexShrink: 0, backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Hello,</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: colors.text, maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user ? user.name : 'Guest'}
              </div>
            </div>
          </div>

          {showUserMenu && (
            <div style={{ position: 'absolute', top: '55px', right: '0', backgroundColor: 'white', boxShadow: colors.shadow, borderRadius: '12px', width: '220px', overflow: 'hidden', border: `1px solid ${colors.border}`, zIndex: 2000 }}>
              
              {/* TRANG CÁ NHÂN */}
              <div 
                onClick={() => { navigate('/profile'); setShowUserMenu(false); }} 
                style={{ padding: '14px 15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: colors.textLight, fontWeight: '600', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = colors.primary; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = colors.textLight; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                My Profile
              </div>

              {/* LỊCH SỬ ĐƠN HÀNG (QUAN TRỌNG) */}
              <div 
                onClick={() => { navigate('/order-history'); setShowUserMenu(false); }} 
                style={{ padding: '14px 15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: colors.textLight, fontWeight: '600', transition: 'all 0.2s', borderTop: `1px solid #f8fafc` }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = colors.primary; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = colors.textLight; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/>
                </svg>
                Order History
              </div>

              {/* ĐĂNG XUẤT */}
              <div 
                onClick={handleLogout} 
                style={{ padding: '14px 15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600', borderTop: `1px solid #f8fafc`, transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}