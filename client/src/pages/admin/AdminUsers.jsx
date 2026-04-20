import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Edit3, Trash2, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) { toast.error('Failed to load users'); }
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800">User Management</h1>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm"><UserPlus size={18} className="inline mr-2"/> Add User</button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold">
            <tr><th className="px-8 py-4">Username</th><th className="px-8 py-4">Full Name</th><th className="px-8 py-4">Role</th><th className="px-8 py-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(user => (
              <tr key={user.Username}>
                <td className="px-8 py-4 font-mono font-bold text-slate-400">{user.Username}</td>
                <td className="px-8 py-4 font-bold text-slate-700">{user.FullName}</td>
                <td className="px-8 py-4">
                  {user.Username.startsWith('AD_') ? 
                    <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-[10px] font-bold uppercase"><Shield size={12} className="inline mr-1"/>Admin</span> : 
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-[10px] font-bold uppercase"><User size={12} className="inline mr-1"/>Customer</span>
                  }
                </td>
                <td className="px-8 py-4 flex gap-2">
                  <button className="text-slate-400 hover:text-blue-600"><Edit3 size={18} /></button>
                  <button className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};