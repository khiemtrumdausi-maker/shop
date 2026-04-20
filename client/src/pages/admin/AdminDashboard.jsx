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
      const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
      const revenue = ordersData
        .filter((o) => o.Status === 'Delivered')
        .reduce((sum, o) => sum + Number(o.TotalPrice || 0), 0);
      setTotalRevenue(revenue);
      setTotalOrders(ordersData.length);
      setTotalCustomers(usersData.length);
    } catch (error) { console.error(error); }
  };

  const loadRecentOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders/all');
      const data = Array.isArray(response.data) ? response.data : [];
      setRecentOrders(data.slice(0, 4));
    } catch (error) { console.error(error); }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const stats = [
    { title: 'Revenue', value: formatCurrency(totalRevenue), icon: <DollarSign size={20} />, color: 'bg-emerald-500' },
    { title: 'Orders', value: totalOrders.toString(), icon: <ShoppingCart size={20} />, color: 'bg-blue-500' },
    { title: 'Customers', value: totalCustomers.toString(), icon: <Users size={20} />, color: 'bg-violet-500' },
    { title: 'Growth', value: '+14%', icon: <TrendingUp size={20} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 mt-0 py-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">System Overview</h1>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Dashboard Control Panel</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-xl font-black text-slate-800">{stat.value}</h3>
            </div>
            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>{stat.icon}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex justify-between items-center"><h2 className="text-base font-black text-slate-800">Recent Orders</h2></div>
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-50 text-xs font-medium">
              {recentOrders.map((order) => (
                <tr key={order.OrderID} className="hover:bg-slate-50/30">
                  <td className="px-6 py-3 font-mono text-slate-400">#ORD-{order.OrderID}</td>
                  <td className="px-6 py-3 text-slate-700">{order.CustomerName || 'Guest'}</td>
                  <td className="px-6 py-3 font-black">{formatCurrency(order.TotalPrice)}</td>
                  <td className="px-6 py-3"><span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">{order.Status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};