// Đường dẫn MỚI (đúng)
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  const colors = { 
    primary: '#2563eb', 
    text: '#0f172a', 
    textLight: '#475569', 
    border: '#e2e8f0' 
  };

  const coreValues = [
    { 
      icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.48 0-4.5 2.02-4.5 4.5S9.52 16.5 12 16.5s4.5-2.02 4.5-4.5S14.48 7.5 12 7.5zm0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>, 
      title: 'Our Vision', 
      desc: 'To become Vietnam\'s leading online shopping destination, providing the most innovative and high-quality fashion products.' 
    },
    { 
      icon: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>, 
      title: 'Customer-Centric', 
      desc: 'All our decisions are rooted in customer satisfaction. We are committed to delivering the ultimate shopping experience.' 
    },
    { 
      icon: <path d="M19 5h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM9 4h6v1H9V4zm10 16H5V7h2v2h10V7h2v13zm-3-8l-4 4-2-2"></path>, 
      title: 'Guaranteed Quality', 
      desc: 'We provide only authentic products, strictly inspected before reaching our consumers.' 
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      
      {/* ================= HEADER DÙNG CHUNG ================= */}
      <Header />
      
      {/* SECTION 1: HERO (BANNER ĐEN & DẢI XANH) */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 81px)' }}>
        <div style={{ backgroundColor: '#111827', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 5%' }}>
          <h1 style={{ fontSize: '48px', color: 'white', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' }}>About Us</h1>
          <p style={{ fontSize: '18px', color: '#9ca3af', maxWidth: '800px', lineHeight: '1.7' }}>
            The journey of CGK SHOP began with a deep passion for fashion and quality. 
            We believe that everyone deserves to experience the very best products.
          </p>
        </div>
        
        <div style={{ backgroundColor: colors.primary, padding: '40px 5%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: 'white' }}>10,000+</div>
              <div style={{ color: '#bfdbfe', fontWeight: '500' }}>Happy Customers</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: 'white' }}>5,000+</div>
              <div style={{ color: '#bfdbfe', fontWeight: '500' }}>Diverse Products</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: 'white' }}>5+</div>
              <div style={{ color: '#bfdbfe', fontWeight: '500' }}>Years of Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: GIÁ TRỊ CỐT LÕI (FLEXBOX ÉP TRÊN 1 HÀNG) */}
      <div style={{ padding: '100px 5%', backgroundColor: '#f8fafc', textAlign: 'center' }}>
        <span style={{ color: colors.primary, fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Core Values</span>
        <h2 style={{ fontSize: '40px', fontWeight: '900', color: colors.text, marginBottom: '60px', letterSpacing: '-1px' }}>Our Commitments</h2>
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'center', 
          alignItems: 'stretch' 
        }}>
          {coreValues.map((value, index) => (
            <div key={index} style={{ 
              flex: 1,
              backgroundColor: 'white', 
              padding: '50px 40px', 
              borderRadius: '24px', 
              textAlign: 'left', 
              border: `1px solid ${colors.border}`, 
              transition: 'all 0.3s', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary, marginBottom: '30px', flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{value.icon}</svg>
              </div>
              <h4 style={{ fontSize: '20px', fontWeight: '800', color: colors.text, marginBottom: '15px' }}>{value.title}</h4>
              <p style={{ fontSize: '15px', color: colors.textLight, lineHeight: '1.7', margin: 0 }}>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CÂU CHUYỆN (2 CỘT: CHỮ & ẢNH) */}
      <div style={{ padding: '100px 5%', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <p style={{ color: colors.primary, fontWeight: '700', textTransform: 'uppercase', fontSize: '14px', marginBottom: '10px' }}>Our Story</p>
          <h2 style={{ fontSize: '40px', fontWeight: '900', color: colors.text, marginBottom: '30px', lineHeight: '1.2' }}>It all started with a dream</h2>
          <p style={{ color: colors.textLight, lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
            Established in 2026, CGK SHOP began as a small boutique specializing in basic apparel. 
            Recognizing the growing demand for highly applicable fashion, we have continuously expanded our scale and style.
          </p>
          <p style={{ color: colors.textLight, lineHeight: '1.8', fontSize: '16px' }}>
            Every product at CGK SHOP is carefully selected for its material and fit, 
            aiming to bring absolute confidence to our customers in every situation.
          </p>
        </div>
        
        <div style={{ borderRadius: '24px', overflow: 'hidden', height: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            alt="Our Story" 
          />
        </div>
      </div>

      {/* ================= FOOTER DÙNG CHUNG ================= */}
      <Footer />

    </div>
  );
}