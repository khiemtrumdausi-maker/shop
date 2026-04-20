import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, Bell, PackageSearch, UserPlus } from 'lucide-react';
import axios from 'axios';

export const AdminDashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadStats();
    loadRecentOrders();
  }, []);

  const loadStats = async () => {
    try {
      const ordersRes = await axios.get('http://localhost:3000/api/orders');
      const usersRes = await axios.get('http://localhost:3000/api/users');
      
      const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];

      const revenue = ordersData
        .filter((o) => o.Status === 'Delivered')
        .reduce((sum, o) => sum + Number(o.TotalPrice || 0), 0);

      setTotalRevenue(revenue);
      setTotalOrders(ordersData.length);
      setTotalCustomers(usersData.filter(u => u.Username?.startsWith('CU_')).length);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      const data = Array.isArray(response.data) ? response.data : [];
      setRecentOrders(data.slice(0, 4));
    } catch (error) {
      console.error('Error loading recent orders:', error);
    }
  };

  const stats = [
    { title: 'REVENUE', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign size={20} />, color: 'bg-emerald-500' },
    { title: 'ORDERS', value: totalOrders.toString(), icon: <ShoppingCart size={20} />, color: 'bg-blue-500' },
    { title: 'CUSTOMERS', value: totalCustomers.toString(), icon: <Users size={20} />, color: 'bg-violet-500' },
    { title: 'GROWTH', value: '+14%', icon: <TrendingUp size={20} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="w-full font-sans">
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Overview</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Dashboard Control Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
            <div className={`${stat.color} w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Section */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-lg font-black text-slate-800">Recent Orders</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline px-3 py-1 bg-blue-50 rounded-full">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.1em] font-bold">
                <tr>
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Total</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {recentOrders.map((order) => (
                  <tr key={order.OrderID} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">#ORD-{order.OrderID}</td>
                    <td className="px-8 py-5 font-bold text-slate-700">{order.Username}</td>
                    <td className="px-8 py-5 font-black text-slate-900">${Number(order.TotalPrice || 0).toFixed(2)}</td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                         order.Status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                       }`}>
                         {order.Status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
             <Bell size={20} className="text-blue-500" /> Notifications
          </h2>
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0 shadow-sm">
                <PackageSearch size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 leading-tight">Low Stock Alert</p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Bomber Jacket Black (L) is almost out.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0 shadow-sm">
                <UserPlus size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 leading-tight">New Customer</p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Account CU_khach_01 was created.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};