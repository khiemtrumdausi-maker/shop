import React, { useState, useEffect } from 'react';
import { Search, Eye, XCircle, CheckCircle, Truck, Package, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      // Đảm bảo lấy đúng mảng dữ liệu
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      console.log("Orders loaded:", data); 
    } catch (error) {
      toast.error('Failed to connect to Database');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, { Status: newStatus });
      toast.success(`Order #${orderId} updated to ${newStatus}`);
      loadOrders();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
      'Confirmed': 'bg-blue-50 text-blue-600 border-blue-100',
      'Shipping': 'bg-purple-50 text-purple-600 border-purple-100',
      'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Cancelled': 'bg-red-50 text-red-600 border-red-100',
    };
    return styles[status] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  // Thống kê đủ 6 thẻ
  const stats = [
    { label: 'TOTAL', value: orders.length, color: 'text-slate-800' },
    { label: 'PENDING', value: orders.filter(o => o.Status === 'Pending').length, color: 'text-orange-500' },
    { label: 'CONFIRMED', value: orders.filter(o => o.Status === 'Confirmed').length, color: 'text-blue-500' },
    { label: 'SHIPPING', value: orders.filter(o => o.Status === 'Shipping').length, color: 'text-purple-500' },
    { label: 'DELIVERED', value: orders.filter(o => o.Status === 'Delivered').length, color: 'text-emerald-500' },
    { label: 'CANCELLED', value: orders.filter(o => o.Status === 'Cancelled').length, color: 'text-red-500' },
  ];

  const filteredOrders = orders.filter(order => {
    // Sửa logic tìm kiếm để khớp với Username hoặc CustomerName từ SQL JOIN
    const orderIdStr = order.OrderID?.toString() || '';
    const customerName = (order.CustomerName || order.Username || '').toLowerCase();
    
    const matchesSearch = orderIdStr.includes(searchTerm) || customerName.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.Status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full font-sans">
      <div className="mb-6 mt-0 py-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Order Management</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control your sales pipeline</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 px-3">
          <Search size={20} className="text-slate-400" />
          <input
            type="text" placeholder="Search Order ID or Customer..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 outline-none"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-slate-50 border-none rounded-xl text-xs font-black text-slate-500 px-6 py-3 cursor-pointer outline-none"
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">ALL STATUS</option>
          <option value="Pending">PENDING</option>
          <option value="Confirmed">CONFIRMED</option>
          <option value="Shipping">SHIPPING</option>
          <option value="Delivered">DELIVERED</option>
          <option value="Cancelled">CANCELLED</option>
        </select>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-8 py-5">Order ID</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Total</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-600">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <tr key={order.OrderID} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">#ORD-{order.OrderID}</td>
                <td className="px-8 py-5">{new Date(order.OrderDate).toLocaleDateString()}</td>
                <td className="px-8 py-5 font-bold text-slate-800">
                  {/* Dùng CustomerName hoặc Username từ lệnh JOIN */}
                  {order.CustomerName || order.Username || 'Guest'}
                </td>
                <td className="px-8 py-5 font-black text-slate-900">
                  {/* Dùng TotalPrice khớp với cột trong MySQL */}
                  ${Number(order.TotalPrice || 0).toFixed(2)}
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusStyle(order.Status)}`}>
                    {order.Status}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <button 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-20 text-center text-slate-400 font-bold">No orders found in Database</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-lg font-black text-slate-800 w-full text-center">Update Order</h2>
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 p-2 hover:bg-white rounded-full"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-3">
              <button onClick={() => handleUpdateStatus(selectedOrder.OrderID, 'Confirmed')} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 border border-blue-100 transition-all"><CheckCircle size={18}/> Confirm Order</button>
              <button onClick={() => handleUpdateStatus(selectedOrder.OrderID, 'Shipping')} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-purple-50 text-purple-600 font-bold text-sm hover:bg-purple-100 border border-purple-100 transition-all"><Truck size={18}/> Start Shipping</button>
              <button onClick={() => handleUpdateStatus(selectedOrder.OrderID, 'Delivered')} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-sm hover:bg-emerald-100 border border-emerald-100 transition-all"><Package size={18}/> Mark as Delivered</button>
              <div className="pt-2 border-t border-slate-50 mt-2">
                <button onClick={() => handleUpdateStatus(selectedOrder.OrderID, 'Cancelled')} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 border border-red-100 transition-all"><XCircle size={18}/> Cancel Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};