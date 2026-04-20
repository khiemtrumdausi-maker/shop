import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/customer/Home';
import Cart from './pages/customer/Cart'; 
import Shop from './pages/customer/Shop';
import About from './pages/customer/About'; 
import Contact from './pages/customer/Contact';
import Profile from './pages/customer/Profile';
import AdminLayout from './components/AdminLayout'; 
import { AdminDashboard } from './pages/admin/AdminDashboard';

// THÀNH PHẦN BẢO VỆ ROUTE ADMIN ĐÃ ĐƯỢC NÂNG CẤP
const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  
  // Lấy Role linh hoạt (Bất chấp Backend trả về chữ hoa hay thường)
  const userRole = userInfo?.Role || userInfo?.role;

  if (userRole && userRole.toString().toLowerCase() === 'admin') {
    return children; // Cho phép vào Dashboard
  }
  
  return <Navigate to="/" />; // Không phải Admin thì về trang chủ khách
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Trả lại sự tự do: Trang chủ ở dấu / */}
        <Route path="/" element={<Home />} /> 
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin vẫn được bảo vệ */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;