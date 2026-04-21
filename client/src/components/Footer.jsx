import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const colors = {
    footerBg: '#0f172a',
    primary: '#2563eb',
    textLight: '#94a3b8'
  };

  return (
    <footer style={{ backgroundColor: colors.footerBg, color: colors.textLight, padding: '80px 5% 30px 5%', fontSize: '15px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '50px', borderBottom: '1px solid #1e293b', paddingBottom: '50px', marginBottom: '30px' }}>
        
        {/* Cột 1: Thông tin shop */}
        <div style={{ flex: 2 }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px 0' }}>CGK SHOP</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
            We pride ourselves on providing high-quality, trend-setting fashion products that perfectly match every style.
          </p>
        </div>

        {/* Cột 2: Danh Mục */}
        <div>
          <h3 style={{ color: 'white', fontSize: '18px', margin: '0 0 20px 0' }}>Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/shop')}>Tops</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/shop')}>Bottoms</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/shop')}>Accessories</span>
          </div>
        </div>

        {/* Cột 3: Chính Sách */}
        <div>
          <h3 style={{ color: 'white', fontSize: '18px', margin: '0 0 20px 0' }}>Policies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{ cursor: 'pointer' }}>Shipping & Delivery</span>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>

        {/* Cột 4: Liên Hệ */}
        <div>
          <h3 style={{ color: 'white', fontSize: '18px', margin: '0 0 20px 0' }}>Contact Us</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span>📍 Posts and Telecommunications Institute of Technology, Hanoi</span>
            <span>📞 +84 123 456 789</span>
            <span>✉️ support@cgkshop.com</span>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
        <span>© 2026 CGK SHOP. All rights reserved.</span>
      </div>
    </footer>
  );
}