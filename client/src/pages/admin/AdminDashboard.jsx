import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
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
      const ordersData = ordersRes.data;

      const usersRes = await axios.get('http://localhost:3000/api/users');
      const usersData = usersRes.data;

      const revenue = ordersData
        .filter((o) => o.Status === 'Delivered')
        .reduce((sum, o) => sum + Number(o.TotalPrice), 0);

      setTotalRevenue(revenue);
      setTotalOrders(ordersData.length);
      setTotalCustomers(usersData.length);
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

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'bg-orange-100 text-orange-700',
      'Confirmed': 'bg-purple-100 text-purple-700',
      'Shipped': 'bg-blue-100 text-blue-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const stats = [
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: <DollarSign className="w-6 h-6 text-white" />, color: 'bg-green-500' },
    { title: 'Total Orders', value: totalOrders.toString(), icon: <ShoppingCart className="w-6 h-6 text-white" />, color: 'bg-blue-500' },
    { title: 'Total Customers', value: totalCustomers.toString(), icon: <Users className="w-6 h-6 text-white" />, color: 'bg-purple-500' },
    { title: 'Growth Rate', value: '+14%', icon: <TrendingUp className="w-6 h-6 text-white" />, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back, Administrator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {recentOrders.map((order) => (
                  <tr key={order.OrderID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-700">#ORD-{String(order.OrderID).padStart(4, '0')}</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">{order.CustomerName}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.OrderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(order.TotalPrice)}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.Status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">System Notifications</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-red-500 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Low Stock Alert</p>
                <p className="text-xs text-gray-500 mt-1">Check inventory for items under 5 units.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New Order</p>
                <p className="text-xs text-gray-500 mt-1">A new order is waiting for confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};