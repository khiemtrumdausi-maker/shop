import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Đường dẫn MỚI (đúng)
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;
  
  const [formData, setFormData] = useState({
    name: user?.name || user?.Name || '',
    email: user?.email || user?.Email || '',
    phone: user?.phone || user?.Phone || '',
    address: user?.address || user?.Address || ''
  });
  
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Kiểm tra ID an toàn
    const userId = user?.id || user?.UserID;

    try {
      const response = await axios.put(`http://localhost:3000/api/auth/update/${userId}`, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      if (response.status === 200) {
        // Cập nhật lại Object user trong localStorage
        const updatedUser = { 
            ...user, 
            name: formData.name, 
            phone: formData.phone, 
            address: formData.address 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Phát sự kiện để Header cập nhật lại tên hiển thị
        window.dispatchEvent(new Event('cartUpdated')); 
        
        setToast('✨ Profile updated successfully!');
      }
    } catch (error) {
      console.error("Update Error:", error);
      setToast('❌ System error. Please try again!');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      {toast && (
        <div style={{ position: 'fixed', top: '90px', right: '20px', backgroundColor: '#1e293b', color: 'white', padding: '14px 24px', borderRadius: '12px', zIndex: 1000, boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
            {toast}
        </div>
      )}

      <div style={{ padding: '60px 5%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '700px', borderRadius: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: '40px', textAlign: 'center', color: 'white' }}>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', italic: 'true' }}>My Profile</h2>
            <p style={{ opacity: 0.8, fontSize: '14px', marginTop: '5px' }}>Manage your personal information</p>
          </div>

          <form onSubmit={handleUpdate} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                <input type="text" placeholder="Your full name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Email Address (Read Only)</label>
                <input type="email" value={formData.email} disabled style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed', boxSizing: 'border-box' }} />
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Phone Number</label>
                <input type="text" placeholder="Your phone number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Shipping Address</label>
                <textarea placeholder="Your delivery address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100px', resize: 'none', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '18px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s', marginTop: '10px' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}