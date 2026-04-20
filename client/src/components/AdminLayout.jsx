import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Users, 
  LogOut 
} from 'lucide-react'; // Import icon chuẩn Figma

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: 'admin@cgkshop.com' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/products', label: 'Products', icon: <Package size={20} /> },
    { path: '/admin/orders', label: 'Orders', icon: <ClipboardList size={20} /> },
    { path: '/admin/customers', label: 'Customers', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-72 bg-[#1e293b] text-white flex flex-col shadow-2xl z-10">
        <div className="p-8 pb-2 text-2xl font-black tracking-wider text-blue-400">
          CGK Shop
        </div>

        {/* Admin Info Box - Chuẩn Figma */}
        <div className="mx-6 my-6 p-4 bg-[#2e3a4e] rounded-xl border border-slate-700/50">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">Logged in as</p>
          <p className="text-sm font-bold text-white truncate">{user.name}</p>
          <p className="text-[11px] text-blue-400 truncate opacity-80">{user.email}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={location.pathname === item.path ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - Sát mép trên */}
      <div className="flex-1 overflow-auto">
        <div className="pt-0 px-10 pb-10 w-full">
          {children}
        </div>
      </div>

    </div>
  );
}