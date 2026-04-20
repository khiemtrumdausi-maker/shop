import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Edit3, Trash2, User, X, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    Name: '', Email: '', Password: '', Phone: '', Address: '', Role: 'Customer', Status: 'Active'
  });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user, Password: '' });
    } else {
      setEditingUser(null);
      setFormData({ Name: '', Email: '', Password: '', Phone: '', Address: '', Role: 'Customer', Status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingUser(null); };

  const stats = [
    { label: 'TỔNG CỘNG', value: users.length, color: 'text-slate-800' },
    { label: 'QUẢN TRỊ', value: users.filter(u => u.Role === 'Admin').length, color: 'text-violet-600' },
    { label: 'KHÁCH HÀNG', value: users.filter(u => u.Role === 'Customer').length, color: 'text-blue-600' },
  ];

  const filteredUsers = users.filter(u => 
    (u.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.Email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterRole === 'all' || u.Role === filterRole)
  );

  return (
    <div className="w-full font-sans">
      <div className="flex justify-between items-center mb-6 mt-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quản Lý Người Dùng</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Hệ thống phân quyền & hồ sơ</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:scale-105 transition-all">
          <UserPlus size={18} /> Thêm Thành Viên
        </button>
      </div>

      {/* Stats - 3 Thẻ lớn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 mb-6 flex gap-4">
        <div className="flex-1 flex items-center gap-3 px-3">
          <Search size={20} className="text-slate-400" />
          <input
            type="text" placeholder="Tìm tên, email hoặc số điện thoại..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 outline-none"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-slate-50 border-none rounded-xl text-xs font-black text-slate-500 px-6 py-3 outline-none cursor-pointer"
          value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">TẤT CẢ VAI TRÒ</option>
          <option value="Admin">ADMIN</option>
          <option value="Customer">CUSTOMER</option>
        </select>
      </div>

      {/* Table - Đầy đủ cột như Database */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-8 py-5">Người dùng</th>
              <th className="px-8 py-5">Liên hệ</th>
              <th className="px-8 py-5">Địa chỉ</th>
              <th className="px-8 py-5 text-center">Vai trò</th>
              <th className="px-8 py-5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium">
            {filteredUsers.map((user) => (
              <tr key={user.UserID} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${user.Role === 'Admin' ? 'bg-violet-100 text-violet-600' : 'bg-blue-100 text-blue-600'}`}>
                      {user.Role === 'Admin' ? <ShieldCheck size={20}/> : <User size={20} />}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 leading-none">{user.Name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">ID: #USR-{user.UserID}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-bold"><Mail size={12} className="text-slate-400"/> {user.Email}</div>
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-bold"><Phone size={12} className="text-slate-400"/> {user.Phone || 'N/A'}</div>
                  </div>
                </td>
                <td className="px-8 py-5 max-w-[200px]">
                  <div className="flex items-start gap-2 text-slate-500 text-xs italic">
                    <MapPin size={14} className="mt-0.5 text-slate-300 shrink-0"/> 
                    <span className="line-clamp-2">{user.Address || 'Chưa cập nhật'}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                    user.Role === 'Admin' ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {user.Role}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Đầy đủ ô nhập liệu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 font-black">
              <h2 className="text-lg text-slate-800 w-full text-center">{editingUser ? 'Cập Nhật Hồ Sơ' : 'Tạo Tài Khoản Mới'}</h2>
              <button onClick={closeModal} className="absolute right-8 p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <form className="p-8 grid grid-cols-2 gap-4">
              <input placeholder="Họ và tên" className="col-span-2 w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.Name} onChange={(e) => setFormData({...formData, Name: e.target.value})} />
              <input placeholder="Email" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.Email} onChange={(e) => setFormData({...formData, Email: e.target.value})} />
              <input placeholder="Số điện thoại" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.Phone} onChange={(e) => setFormData({...formData, Phone: e.target.value})} />
              <input placeholder="Địa chỉ" className="col-span-2 w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.Address} onChange={(e) => setFormData({...formData, Address: e.target.value})} />
              <select className="col-span-2 w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-500 outline-none" value={formData.Role} onChange={(e) => setFormData({...formData, Role: e.target.value})}>
                <option value="Customer">Khách hàng (Customer)</option>
                <option value="Admin">Quản trị viên (Admin)</option>
              </select>
              <button type="button" className="col-span-2 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all mt-2">
                {editingUser ? 'Lưu Thay Đổi' : 'Tạo Người Dùng'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};