import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      const userData = response.data.user;
      
      localStorage.setItem('user', JSON.stringify(userData));
      window.dispatchEvent(new Event('cartUpdated'));

      // ĐIỀU HƯỚNG AN TOÀN (Không làm hỏng trang chủ)
      const userRole = userData.Role || userData.role;
      if (userRole && userRole.toString().toLowerCase() === 'admin') {
        navigate('/admin'); // Admin thì vào Dashboard
      } else {
        navigate('/'); // Khách hàng thì về trang chủ gốc (Header giữ nguyên gạch chân)
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
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
          
          {/* Cột Trái: Form */}
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: colors.text, marginBottom: '10px' }}>Welcome Back!</h1>
            <p style={{ color: colors.textLight, marginBottom: '40px' }}>Please log in to continue shopping.</p>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'left' }}>⚠️ {error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" placeholder="example@email.com" required onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
              </div>
              <div style={{ textAlign: 'right' }}><span style={{ fontSize: '14px', color: colors.primary, fontWeight: '600', cursor: 'pointer' }}>Forgot password?</span></div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: loading ? '#94a3b8' : colors.primary, color: 'white', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', marginTop: '10px' }} onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primaryHover)}>
                {loading ? 'Processing...' : 'Login'}
              </button>
            </form>

            <p style={{ marginTop: '30px', color: colors.textLight }}>Don't have an account? <span onClick={() => navigate('/register')} style={{ color: colors.primary, fontWeight: '700', cursor: 'pointer' }}>Register now</span></p>
          </div>

          {/* Cột Phải: Ảnh/Gradient */}
          <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, #1d4ed8 100%)`, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '20px' }}>CGK SHOP</h2>
            <p style={{ lineHeight: '1.6', color: '#bfdbfe' }}>Discover the latest fashion collections and define your own style.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}