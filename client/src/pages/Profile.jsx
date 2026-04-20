import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:3000/api/auth/update/${user.id}`, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      if (response.status === 200) {
        const updatedUser = { ...user, name: formData.name, phone: formData.phone, address: formData.address };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('cartUpdated')); 
        setToast('✨ Cập nhật thành công!');
      }
    } catch (error) {
      setToast('❌ Lỗi hệ thống!');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      {toast && <div style={{ position: 'fixed', top: '90px', right: '20px', backgroundColor: '#1e293b', color: 'white', padding: '14px 24px', borderRadius: '12px', zIndex: 1000 }}>{toast}</div>}
      <div style={{ padding: '60px 5%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '700px', borderRadius: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: '40px', textAlign: 'center', color: 'white' }}>
            <h2 style={{ margin: 0 }}>Hồ Sơ Cá Nhân</h2>
          </div>
          <form onSubmit={handleUpdate} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" placeholder="Họ tên" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <input type="text" placeholder="Số điện thoại" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <textarea placeholder="Địa chỉ" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100px' }} />
            <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}