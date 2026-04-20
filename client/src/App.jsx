import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Giữ Login và Register ở ngoài thư mục customer
import Login from './pages/Login';
import Register from './pages/Register';

// 2. Các trang dành cho khách hàng đã chuyển vào thư mục customer
import Home from './pages/customer/Home';
import Cart from './pages/customer/Cart'; 
import Shop from './pages/customer/Shop';
import About from './pages/customer/About'; 
import Contact from './pages/customer/Contact';
import Profile from './pages/customer/Profile';

// 3. Các trang dành cho Admin (Bạn sẽ tạo trong pages/admin/)
// import AdminLayout from './pages/admin/AdminLayout';
// import Dashboard from './pages/admin/Dashboard';

// Thành phần bảo vệ Route cho Admin
const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  // Kiểm tra Role từ Database clothesshopdb
  if (userInfo && userInfo.Role === 'Admin') {
    return children;
  }
  return <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Xác thực chung */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Giao diện Khách hàng */}
        <Route path="/" element={<Home />} /> 
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />

        {/* Giao diện Quản trị (Admin) */}
        {/* <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout /> 
          </AdminRoute>
        }>
          <Route index element={<Dashboard />} />
        </Route> 
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;