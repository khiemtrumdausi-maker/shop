import React, { useState, useEffect } from 'react';
import { Search, Eye, XCircle, Truck, Package, X, Phone, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]); // Store products in order
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to connect to Database');
    }
  };

  // Fetch product items when clicking view
  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await axios.get(`http://localhost:3000/api/orders/${order.OrderID}/details`);
      setOrderDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch order details');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order #${orderId} updated to ${newStatus}`);
      loadOrders();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
      'Shipping': 'bg-blue-50 text-blue-600 border-blue-100',
      'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Cancelled': 'bg-red-50 text-red-600 border-red-100',
    };
    return styles[status] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const stats = [
    { label: 'TOTAL', value: orders.length, color: 'text-slate-800' },
    { label: 'PENDING', value: orders.filter(o => o.Status === 'Pending').length, color: 'text-orange-500' },
    { label: 'SHIPPING', value: orders.filter(o => o.Status === 'Shipping').length, color: 'text-blue-500' },
    { label: 'DELIVERED', value: orders.filter(o => o.Status === 'Delivered').length, color: 'text-emerald-500' },
    { label: 'CANCELLED', value: orders.filter(o => o.Status === 'Cancelled').length, color: 'text-red-500' },
  ];

  const filteredOrders = orders.filter(order => {
    const orderIdStr = order.OrderID?.toString() || '';
    const customerName = (order.CustomerName || '').toLowerCase();
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

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
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
          <option value="Shipping">SHIPPING</option>
          <option value="Delivered">DELIVERED</option>
          <option value="Cancelled">CANCELLED</option>
        </select>
      </div>

      {/* Orders Table */}
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
                <td className="px-8 py-5 font-bold text-slate-800 uppercase italic">{order.CustomerName || 'Guest'}</td>
                <td className="px-8 py-5 font-black text-blue-600">{Number(order.TotalPrice).toLocaleString()}đ</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusStyle(order.Status)}`}>
                    {order.Status}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <button 
                    onClick={() => handleViewDetails(order)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 relative">
              <h2 className="text-lg font-black text-slate-800 w-full text-center uppercase italic">Order Details #ORD-{selectedOrder.OrderID}</h2>
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 p-2 hover:bg-white rounded-full text-slate-400"><X size={20}/></button>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-8">
              {/* Left Side: Information & Actions */}
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Shipping Information</p>
                  <div className="bg-slate-50 p-5 rounded-[2rem] space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <User size={14} className="text-blue-500"/> {selectedOrder.CustomerName}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <Phone size={14} className="text-blue-500"/> {selectedOrder.CustomerPhone || 'N/A'}
                    </div>
                    <div className="flex items-start gap-3 text-xs font-bold text-slate-700 leading-tight">
                      <MapPin size={14} className="text-blue-500 flex-shrink-0 mt-1"/> {selectedOrder.CustomerAddress || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Available Actions</p>
                  
                  {selectedOrder.Status === 'Pending' && (
                    <button onClick={() => handleUpdateStatus(selectedOrder.OrderID, 'Shipping')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                      <Truck size={16}/> Confirm & Ship
                    </button>
                  )}
                  {selectedOrder.Status === 'Shipping' && (
                    <button onClick={() => handleUpdateStatus(selectedOrder.OrderID, 'Delivered')} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                      <Package size={16}/> Mark Delivered
                    </button>
                  )}
                  {!['Delivered', 'Cancelled'].includes(selectedOrder.Status) && (
                    <button onClick={() => handleUpdateStatus(selectedOrder.OrderID, 'Cancelled')} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                      <XCircle size={16}/> Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side: Items Ordered */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Items Ordered</p>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {orderDetails.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                      <img src={`http://localhost:3000${item.ImagePath}`} alt="" className="w-12 h-12 object-cover rounded-xl" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-800 line-clamp-1">{item.ProductName}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Size: {item.SizeName} | Qty: {item.Quantity}</p>
                      </div>
                      <p className="text-xs font-black text-slate-900">{Number(item.Price).toLocaleString()}đ</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase italic">Total Payment</span>
                  <span className="text-xl font-black text-blue-600 tracking-tighter">{Number(selectedOrder.TotalPrice).toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};