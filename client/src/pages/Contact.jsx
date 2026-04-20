import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState('');

  const colors = {
    primary: '#2563eb', 
    primaryHover: '#1d4ed8', 
    background: '#f8fafc', 
    text: '#0f172a', 
    textLight: '#64748b', 
    border: '#e2e8f0', 
    footerBg: '#0f172a', 
    shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setToast('✨ Tin nhắn đã được gửi đi thành công.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setToast(''), 4000);
  };

  const inputStyle = { width: '100%', padding: '16px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', fontSize: '15px', color: colors.text, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '700', color: colors.text, marginBottom: '8px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      <Header />

      {toast && (
        <div style={{ position: 'fixed', top: '90px', right: '20px', backgroundColor: colors.footerBg, color: 'white', padding: '14px 24px', borderRadius: '12px', zIndex: 1000, boxShadow: colors.shadow }}>{toast}</div>
      )}

      {/* 1. TIÊU ĐỀ CENTER */}
      <div style={{ textAlign: 'center', padding: '60px 5% 40px' }}>
        <h1 style={{ fontSize: '42px', color: colors.text, fontWeight: '900', margin: '0 0 15px 0', letterSpacing: '-1px' }}>Liên Hệ Với Chúng Tôi</h1>
        <p style={{ fontSize: '16px', color: colors.textLight, maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ CGK SHOP luôn sẵn sàng lắng nghe bạn.
        </p>
      </div>

      {/* 2. KHỐI THÔNG TIN VÀ FORM */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 60px auto', padding: '0 5%', display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(500px, 2fr)', gap: '30px', alignItems: 'stretch' }}>
        
        {/* KHỐI TRÁI: THÔNG TIN (ĐÃ FIX CĂN GIỮA THẲNG HÀNG) */}
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: colors.shadow, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: colors.text, marginBottom: '40px' }}>Thông Tin Liên Hệ</h2>
          
          {/* Container này giúp các dòng icon + chữ luôn thẳng hàng với nhau nhưng khối vẫn nằm giữa Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', width: 'fit-content' }}>
            
            {/* Điện thoại */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '45px', height: '45px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary, flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '700', color: colors.textLight, textTransform: 'uppercase' }}>Điện thoại</h4>
                <p style={{ margin: 0, fontSize: '16px', color: colors.primary, fontWeight: '700' }}>+84 123 456 789</p>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '45px', height: '45px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary, flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '700', color: colors.textLight, textTransform: 'uppercase' }}>Email</h4>
                <p style={{ margin: 0, fontSize: '16px', color: colors.primary, fontWeight: '700' }}>support@cgkshop.vn</p>
              </div>
            </div>

            {/* Địa chỉ */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '45px', height: '45px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary, flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '700', color: colors.textLight, textTransform: 'uppercase' }}>Địa chỉ</h4>
                <p style={{ margin: 0, fontSize: '16px', color: colors.primary, fontWeight: '700' }}>Km10, Nguyễn Trãi, Hà Đông, HN</p>
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI PHẢI: FORM NHẮN TIN */}
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: colors.shadow }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: colors.text, marginBottom: '30px' }}>Gửi Tin Nhắn</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ width: '100%' }}>
              <label style={labelStyle}>Họ và tên</label>
              <input type="text" name="name" placeholder="Nguyễn Văn A" value={formData.name} onChange={handleInputChange} required style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
            </div>
            <div style={{ width: '100%' }}>
              <label style={labelStyle}>Địa chỉ Email</label>
              <input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleInputChange} required style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Chủ đề</label>
              <input type="text" name="subject" placeholder="Vấn đề cần hỗ trợ?" value={formData.subject} onChange={handleInputChange} style={inputStyle} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Nội dung tin nhắn</label>
              <textarea name="message" placeholder="Nhập nội dung tin nhắn..." value={formData.message} onChange={handleInputChange} required rows="5" style={{ ...inputStyle, resize: 'none' }} onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`} onBlur={(e) => e.target.style.boxShadow = 'none'}></textarea>
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
              <button type="submit" style={{ padding: '14px 30px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s', width: 'fit-content' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Gửi Tin Nhắn
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. BẢN ĐỒ FULL WIDTH */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 5%' }}>
        <div style={{ position: 'relative', width: '100%', height: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: colors.shadow }}>
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Map Location" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '15px 25px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '16px', fontWeight: '800', color: colors.text }}>CGK SHOP</h4>
              <p style={{ margin: 0, fontSize: '14px', color: colors.textLight }}>Km10, Nguyễn Trãi, Hà Đông</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}