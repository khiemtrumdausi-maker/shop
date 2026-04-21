import React, { useState, useEffect } from 'react';
import { Search, Trash2, User, X, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Giữ lại state Modal phòng trường hợp sếp muốn mở xem thông tin chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  // --- HÀM ĐỔI TRẠNG THÁI TÀI KHOẢN ---
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const res = await axios.patch(`http://localhost:3000/api/auth/users/${userId}/status`, {
        currentStatus: currentStatus
      });
      toast.success(`User is now ${res.data.newStatus}`);
      loadUsers(); 
    } catch (error) {
      toast.error('Could not update user status');
    }
  };

  // --- HÀM XÓA USER ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/auth/users/${userId}`);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const stats = [
    { label: 'TOTAL USERS', value: users.length, color: 'text-slate-800' },
    { label: 'ADMINISTRATORS', value: users.filter(u => u.Role === 'Admin').length, color: 'text-violet-600' },
    { label: 'CUSTOMERS', value: users.filter(u => u.Role === 'Customer').length, color: 'text-blue-600' },
  ];

  const filteredUsers = users.filter(u => 
    ((u.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (u.Email || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterRole === 'all' || u.Role === filterRole)
  );

  return (
    <div className="w-full font-sans">
      <div className="flex justify-between items-center mb-6 mt-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">User Management</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Permission System & Status Control</p>
        </div>
        {/* NÚT ADD NEW USER ĐÃ BỊ LOẠI BỎ Ở ĐÂY */}
      </div>

      {/* Stats Cards */}
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
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 outline-none"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-slate-50 border-none rounded-xl text-xs font-black text-slate-500 px-6 py-3 outline-none cursor-pointer"
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">ALL ROLES</option>
          <option value="Admin">ADMIN</option>
          <option value="Customer">CUSTOMER</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-8 py-5">User Profile</th>
              <th className="px-8 py-5">Contact Details</th>
              <th className="px-8 py-5">Location</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-center">Actions</th>
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
                      <span className="text-[9px] font-black uppercase text-slate-400 mt-1">ID: #USR-{user.UserID} • {user.Role}</span>
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
                    <span className="line-clamp-2">{user.Address || 'No address set'}</span>
                  </div>
                </td>
                
                <td className="px-8 py-5 text-center">
                  <button 
                    onClick={() => handleToggleStatus(user.UserID, user.Status)}
                    className={`group relative px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all duration-300 ${
                      user.Status === 'Active' 
                      ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white' 
                      : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    <span className="group-hover:hidden">{user.Status || 'Active'}</span>
                    <span className="hidden group-hover:inline">Toggle</span>
                  </button>
                </td>

                <td className="px-8 py-5 text-center">
                  <div className="flex justify-center gap-2">
                    {/* NÚT EDIT ĐÃ BỊ XÓA Ở ĐÂY, CHỈ CÒN NÚT TRASH */}
                    <button 
                      onClick={() => handleDeleteUser(user.UserID)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal View Detail (Tùy chọn: Giữ lại để xem full info nếu cần) */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden p-8">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">User Information</h2>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
             </div>
             <div className="space-y-4 text-left">
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Full Name</p>
                    <p className="font-bold text-slate-700">{selectedUser.Name}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Email</p>
                    <p className="font-bold text-slate-700">{selectedUser.Email}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Phone</p>
                    <p className="font-bold text-slate-700">{selectedUser.Phone || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Address</p>
                    <p className="font-bold text-slate-700 italic">{selectedUser.Address || 'N/A'}</p>
                </div>
             </div>
             <button onClick={closeModal} className="w-full mt-6 py-4 bg-slate-800 text-white rounded-2xl font-black">CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
};