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
      const ordersRes = await axios.get('http://localhost:3000/api/orders/all');
      const usersRes = await axios.get('http://localhost:3000/api/users');
      const revenue = ordersRes.data
        .filter((o) => o.Status === 'Delivered')
        .reduce((sum, o) => sum + Number(o.TotalPrice), 0);
      setTotalRevenue(revenue);
      setTotalOrders(ordersRes.data.length);
      setTotalCustomers(usersRes.data.length);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders/all');
      setRecentOrders(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error loading recent orders:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const stats = [
    { title: 'Revenue', value: formatCurrency(totalRevenue), icon: <DollarSign size={20} />, color: 'bg-emerald-500' },
    { title: 'Orders', value: totalOrders.toString(), icon: <ShoppingCart size={20} />, color: 'bg-blue-500' },
    { title: 'Customers', value: totalCustomers.toString(), icon: <Users size={20} />, color: 'bg-violet-500' },
    { title: 'Growth', value: '+14%', icon: <TrendingUp size={20} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="w-full">
      {/* 1. Header gọn hơn (py-4 thay vì py-6) */}
      <div className="mb-6 mt-0 py-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">System Overview</h1>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Dashboard Control Panel</p>
      </div>

      {/* 2. Thẻ Stats thu nhỏ lại */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-xl font-black text-slate-800">{stat.value}</h3>
            </div>
            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Bảng dữ liệu gọn hơn (py-3 thay vì py-5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-base font-black text-slate-800">Recent Orders</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-medium">
                {recentOrders.map((order) => (
                  <tr key={order.OrderID} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-3 font-mono text-slate-400">#ORD-{order.OrderID}</td>
                    <td className="px-6 py-3 text-slate-700">{order.CustomerName}</td>
                    <td className="px-6 py-3 font-black text-slate-900">{formatCurrency(order.TotalPrice)}</td>
                    <td className="px-6 py-3">
                       <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">{order.Status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Notifications gọn hơn */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
             <Bell size={16} className="text-blue-500" /> Notifications
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                <PackageSearch size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">Low Stock Alert</p>
                <p className="text-[10px] text-slate-400 mt-1">Bomber Jacket Black (L) is almost out.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                <UserPlus size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">New Customer</p>
                <p className="text-[10px] text-slate-400 mt-1">New user registered.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};