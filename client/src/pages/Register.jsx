import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const colors = {
    primary: '#2563eb', primaryHover: '#1d4ed8', background: '#f8fafc',
    text: '#0f172a', textLight: '#64748b', border: '#e2e8f0',
    shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Mật khẩu xác nhận không khớp');
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/auth/register', formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '16px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', fontSize: '15px', color: colors.text, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '700', color: colors.text, marginBottom: '8px', textAlign: 'left' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      <Header />
      
      <div style={{ padding: '60px 5%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', display: 'grid', gridTemplateColumns: '1.2fr 1fr', borderRadius: '32px', overflow: 'hidden', boxShadow: colors.shadow, maxWidth: '1000px', width: '100%' }}>
          
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: colors.text, marginBottom: '10px' }}>Tạo tài khoản</h1>
            <p style={{ color: colors.textLight, marginBottom: '40px' }}>Tham gia cùng cộng đồng CGK SHOP ngay hôm nay.</p>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'left' }}>⚠️ {error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Họ và tên</label>
                <input type="text" name="name" placeholder="Nguyễn Văn A" required onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
              </div>
              <div>
                <label style={labelStyle}>Địa chỉ Email</label>
                <input type="email" name="email" placeholder="example@email.com" required onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Mật khẩu</label>
                  <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
                </div>
                <div>
                  <label style={labelStyle}>Xác nhận</label>
                  <input type="password" name="confirmPassword" placeholder="••••••••" required onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: loading ? '#94a3b8' : colors.primary, color: 'white', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', marginTop: '10px' }} onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primaryHover)}>
                {loading ? 'Đang tạo...' : 'Đăng Ký'}
              </button>
            </form>

            <p style={{ marginTop: '30px', color: colors.textLight }}>Đã có tài khoản? <span onClick={() => navigate('/login')} style={{ color: colors.primary, fontWeight: '700', cursor: 'pointer' }}>Đăng nhập ngay</span></p>
          </div>

          <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, #1d4ed8 100%)`, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '20px' }}>Gia nhập CGK</h2>
            <p style={{ lineHeight: '1.6', color: '#bfdbfe' }}>Nhận ngay thông tin về các chương trình khuyến mãi và bộ sưu tập giới hạn sớm nhất.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}