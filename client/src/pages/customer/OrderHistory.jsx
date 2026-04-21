import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, X, ShoppingBag, User, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        loadOrders();
    }, [user?.id]);

    const loadOrders = async () => {
        if (!user?.id) return;
        try {
            const res = await axios.get(`http://localhost:3000/api/orders/user/${user.id}`);
            setOrders(res.data);
        } catch (error) {
            console.error("Fetch orders error:", error);
            toast.error("Failed to load your orders");
        } finally {
            setLoading(false);
        }
    };

    // Hàm này dùng để mở Modal và bốc dữ liệu sản phẩm từ Server
    const handleViewDetails = async (order) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/orders/${order.OrderID}/details`);
            setOrderDetails(res.data);
            setSelectedOrder(order); // Lưu order được chọn
            setIsModalOpen(true);    // Mở Modal
        } catch (error) {
            toast.error("Failed to load item details");
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, { status: 'Cancelled' });
            toast.success("Order cancelled successfully!");
            loadOrders();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Error cancelling order");
        }
    };

    const tabs = [
        { id: 'all', label: 'ALL ORDERS', icon: <Package size={14}/> },
        { id: 'Pending', label: 'PENDING', icon: <Clock size={14}/> },
        { id: 'Shipping', label: 'SHIPPING', icon: <Truck size={14}/> },
        { id: 'Delivered', label: 'DELIVERED', icon: <CheckCircle size={14}/> },
        { id: 'Cancelled', label: 'CANCELLED', icon: <XCircle size={14}/> },
    ];

    const filteredOrders = orders.filter(order => filterStatus === 'all' || order.Status === filterStatus);

    const getStatusStyle = (status) => {
        const config = {
            Pending: 'bg-orange-100 text-orange-700',
            Shipping: 'bg-blue-100 text-blue-700',
            Delivered: 'bg-emerald-100 text-emerald-700',
            Cancelled: 'bg-red-100 text-red-700'
        };
        return config[status] || 'bg-slate-100 text-slate-700';
    };

    if (loading) return <div className="p-20 text-center font-black italic tracking-widest text-slate-300 animate-pulse uppercase">FETCHING DATA...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen bg-white font-sans">
            <div className="mb-10 text-left">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Order History</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Track and manage your recent purchases</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterStatus(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all ${
                            filterStatus === tab.id 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[3.5rem] border-2 border-dashed border-slate-200">
                    <ShoppingBag className="mx-auto text-slate-200 mb-6" size={64} />
                    <p className="text-slate-400 font-black uppercase italic tracking-widest text-xs">No orders found in this section</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order.OrderID} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 hover:shadow-2xl hover:shadow-slate-100 transition-all flex flex-col md:flex-row justify-between items-center gap-6 text-left">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusStyle(order.Status)} shadow-inner`}>
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">#ORD-{order.OrderID}</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter italic">Placed on {new Date(order.OrderDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Total Payment</p>
                                    <p className="text-xl font-black text-blue-600 tracking-tighter">{Number(order.TotalPrice).toLocaleString()}đ</p>
                                </div>
                                {/* ĐÃ GẮN onClick Ở ĐÂY CHO KHIÊM */}
                                <button 
                                    onClick={() => handleViewDetails(order)}
                                    className="px-8 py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase hover:bg-blue-600 transition-all flex items-center gap-2"
                                >
                                    <Eye size={14} /> View details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Chi Tiết - Luôn nằm trong return nhưng chỉ hiện khi isModalOpen = true */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 relative">
                            <h2 className="text-lg font-black text-slate-800 w-full text-center uppercase italic tracking-tight pl-4">Order Details #ORD-{selectedOrder.OrderID}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-8 p-2 hover:bg-white rounded-full text-slate-400">
                                <X size={20}/>
                            </button>
                        </div>
                        
                        <div className="p-8 grid md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Shipping Information</p>
                                    <div className="bg-slate-50 p-5 rounded-[2rem] space-y-3">
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                            <User size={14} className="text-blue-500"/> {user?.name || 'Customer'}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                            <Phone size={14} className="text-blue-500"/> {user?.phone || 'N/A'}
                                        </div>
                                        <div className="flex items-start gap-3 text-xs font-bold text-slate-700 leading-tight">
                                            <MapPin size={14} className="text-blue-500 flex-shrink-0 mt-1"/> {user?.address || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {selectedOrder.Status === 'Pending' && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => handleCancelOrder(selectedOrder.OrderID)}
                                            className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-black text-[10px] uppercase border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16}/> Cancel Order
                                        </button>
                                        <p className="text-[9px] text-center text-slate-400 mt-3 font-bold uppercase italic">* Cancellation is only available for pending orders</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Order Summary</p>
                                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar text-left">
                                    {orderDetails.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-2xl">
                                            <img src={`http://localhost:3000${item.ImagePath}`} className="w-12 h-12 object-cover rounded-xl shadow-sm" alt="" />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-slate-800 line-clamp-1">{item.ProductName}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Size: {item.SizeName} | Qty: {item.Quantity}</p>
                                            </div>
                                            <p className="text-xs font-black text-slate-900">{Number(item.Price).toLocaleString()}đ</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Total Amount:</span>
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