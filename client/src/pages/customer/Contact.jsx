import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Contact() {
  const navigate = useNavigate();

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      <Header />

      {/* 1. HERO TITLE */}
      <div style={{ textAlign: 'center', padding: '80px 5% 60px' }}>
        <h1 style={{ fontSize: '48px', color: colors.text, fontWeight: '900', margin: '0 0 15px 0', letterSpacing: '-1px' }}>Contact Us</h1>
        <p style={{ fontSize: '18px', color: colors.textLight, maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Have questions or need support? The CGK SHOP team is always here to help you.
        </p>
      </div>

      {/* 2. CONTACT INFO CARDS (3 Cột nằm ngang) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 60px auto', padding: '0 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* Phone Card */}
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: colors.shadow, textAlign: 'center', border: `1px solid ${colors.border}` }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary, margin: '0 auto 20px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: colors.text, marginBottom: '10px', textTransform: 'uppercase' }}>Phone Number</h3>
          <p style={{ fontSize: '18px', color: colors.primary, fontWeight: '700', margin: 0 }}>+84 123 456 789</p>
          <p style={{ fontSize: '14px', color: colors.textLight, marginTop: '5px' }}>Mon - Sat, 8:00 AM - 9:00 PM</p>
        </div>

        {/* Email Card */}
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: colors.shadow, textAlign: 'center', border: `1px solid ${colors.border}` }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary, margin: '0 auto 20px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: colors.text, marginBottom: '10px', textTransform: 'uppercase' }}>Email Address</h3>
          <p style={{ fontSize: '18px', color: colors.primary, fontWeight: '700', margin: 0 }}>support@cgkshop.com</p>
          <p style={{ fontSize: '14px', color: colors.textLight, marginTop: '5px' }}>We usually reply within 24 hours</p>
        </div>

        {/* Address Card */}
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: colors.shadow, textAlign: 'center', border: `1px solid ${colors.border}` }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary, margin: '0 auto 20px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: colors.text, marginBottom: '10px', textTransform: 'uppercase' }}>Our Location</h3>
          <p style={{ fontSize: '16px', color: colors.primary, fontWeight: '700', margin: 0 }}>Km10, Nguyen Trai, Ha Dong, Hanoi</p>
          <p style={{ fontSize: '14px', color: colors.textLight, marginTop: '5px' }}>Posts and Telecommunications Institute of Technology</p>
        </div>

      </div>

      {/* 3. BẢN ĐỒ CHIẾM VỊ TRÍ TRUNG TÂM */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 100px auto', padding: '0 5%' }}>
        <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: `1px solid ${colors.border}` }}>
          {/* Thay đổi URL ảnh hoặc nhúng iframe Google Map vào đây */}
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Store Location" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          
          {/* Tag địa chỉ nổi trên bản đồ */}
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', backgroundColor: 'white', padding: '20px 30px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', borderLeft: `6px solid ${colors.primary}` }}>
            <div style={{ width: '45px', height: '45px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '18px', fontWeight: '900', color: colors.text }}>CGK SHOP HEADQUARTERS</h4>
              <p style={{ margin: 0, fontSize: '14px', color: colors.textLight, fontWeight: '500' }}>Km10, Nguyen Trai St, Ha Dong District, Hanoi</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}