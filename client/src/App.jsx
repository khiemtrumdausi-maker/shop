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
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';

const HomeRedirect = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const userRole = (userInfo?.Role || userInfo?.role || '').toString().toLowerCase();
  if (userRole === 'admin') return <Navigate to="/admin" replace />;
  return <Home />;
};

const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const userRole = (userInfo?.Role || userInfo?.role || '').toString().toLowerCase();
  if (userRole === 'admin') return children;
  return <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomeRedirect />} /> 
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;