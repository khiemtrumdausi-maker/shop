import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'; // Bắt buộc import thêm useEffect

export default function Home() {
  const navigate = useNavigate();
  const colors = { 
    primary: '#2563eb', 
    background: '#ffffff', 
    text: '#0f172a', 
    textLight: '#475569' 
  };

  // --- LOGIC BẮT BUỘC ĐĂNG NHẬP ---
  useEffect(() => {
    // Kiểm tra xem có dữ liệu 'user' trong localStorage không
    const user = localStorage.getItem('user');
    if (!user) {
      // Nếu không có (chưa đăng nhập), lập tức chuyển sang trang Đăng Nhập
      navigate('/login');
    }
  }, [navigate]);
  // ---------------------------------

  const features = [
    { 
      icon: <><path d="M5 9V18H19V13H14V9H5Z"></path><line x1="14" y1="13" x2="19" y2="13"></line><circle cx="9" cy="18" r="2"></circle><circle cx="15" cy="18" r="2"></circle></>, 
      title: 'Giao hàng miễn phí', 
      desc: 'Đảm bảo 100% tận tâm' 
    },
    { 
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>, 
      title: 'Thanh toán an toàn', 
      desc: 'Đảm bảo 100% bảo mật' 
    },
    { 
      icon: <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></>, 
      title: 'Hỗ trợ 24/7', 
      desc: 'Đội ngũ chăm sóc tận tình' 
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      
      {/* ================= HEADER DÙNG CHUNG ================= */}
      <Header />

      {/* HERO BANNER */}
      <div style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', padding: '0 5%', backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.75)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px', textAlign: 'left' }}>
          <span style={{ backgroundColor: '#eff6ff', color: colors.primary, padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block', marginBottom: '25px' }}>Bộ Sưu Tập Mới 2026</span>
          <h1 style={{ fontSize: '64px', fontWeight: '900', color: '#0f172a', lineHeight: '1.1', margin: '0 0 25px 0', letterSpacing: '-1.5px' }}>Khám Phá Phong Cách Đích Thực Của Bạn</h1>
          <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '40px', maxWidth: '500px' }}>Trải nghiệm mua sắm tuyệt vời với những xu hướng thời trang nam nữ mới nhất, tự tin thể hiện phong cách cá nhân của bạn.</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => navigate('/shop')} 
              style={{ padding: '15px 40px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Mua Ngay <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* DẢI CHÍNH SÁCH */}
      <div style={{ padding: '70px 5%', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', justifyContent: 'center' }}>
          {features.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary, flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: colors.text, fontWeight: '700' }}>{item.title}</h4>
                <p style={{ margin: 0, color: colors.textLight, fontSize: '14px' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER DÙNG CHUNG ================= */}
      <Footer />

    </div>
  );
}