import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart'; 
import Shop from './pages/Shop';
import About from './pages/About'; 
import Contact from './pages/Contact';
import Profile from './pages/Profile'; // Chỉ giữ lại Profile

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/" element={<Home />} /> 
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} />
        {/* Route duy nhất mới thêm vào */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;