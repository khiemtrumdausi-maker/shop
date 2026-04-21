import React from 'react';
import { X, User, Phone, MapPin, Truck, Package, Clock, XCircle } from 'lucide-react';

export const OrderDetailsModal = ({ isOpen, onClose, order, details, isAdmin, onUpdateStatus }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 relative">
                    <h2 className="text-lg font-black text-slate-800 w-full text-center uppercase italic">
                        Order Details #ORD-{order.OrderID}
                    </h2>
                    <button onClick={onClose} className="absolute right-8 p-2 hover:bg-white rounded-full text-slate-400">
                        <X size={20}/>
                    </button>
                </div>
                
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    {/* Left Side: Information & Actions */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left italic">Shipping Information</p>
                            <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-700 leading-tight text-left">
                                    <User size={14} className="text-blue-500 flex-shrink-0"/> 
                                    {/* Sửa: Ưu tiên CustomerName, nếu không có thì lấy Name hoặc mặc định */}
                                    {order.CustomerName || order.Name || 'Guest Customer'}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-700 leading-tight text-left">
                                    <Phone size={14} className="text-blue-500 flex-shrink-0"/> 
                                    {order.CustomerPhone || order.Phone || 'Contact not provided'}
                                </div>
                                <div className="flex items-start gap-3 text-xs font-bold text-slate-700 leading-relaxed text-left">
                                    <MapPin size={14} className="text-blue-500 flex-shrink-0 mt-1"/> 
                                    {order.CustomerAddress || order.Address || 'No shipping address'}
                                </div>
                            </div>
                        </div>

                        {/* Available Actions */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left italic">Available Actions</p>
                            
                            {isAdmin ? (
                                <div className="space-y-2">
                                    {order.Status === 'Pending' && (
                                        <button onClick={() => onUpdateStatus(order.OrderID, 'Shipping')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                            <Truck size={16}/> Confirm & Start Shipping
                                        </button>
                                    )}
                                    {order.Status === 'Shipping' && (
                                        <button onClick={() => onUpdateStatus(order.OrderID, 'Delivered')} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                            <Package size={16}/> Mark as Delivered
                                        </button>
                                    )}
                                    {!['Delivered', 'Cancelled'].includes(order.Status) && (
                                        <button onClick={() => onUpdateStatus(order.OrderID, 'Cancelled')} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                            <XCircle size={16}/> Cancel & Restock
                                        </button>
                                    )}
                                </div>
                            ) : (
                                order.Status === 'Pending' ? (
                                    <button onClick={() => onUpdateStatus(order.OrderID, 'Cancelled')} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                        <XCircle size={16}/> Cancel My Order
                                    </button>
                                ) : (
                                    <div className="p-5 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase italic leading-none mb-1">Status</p>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tighter italic">Your order is {order.Status}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left italic">Items Ordered</p>
                        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                            {details.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm hover:border-blue-100 transition-colors">
                                    <img 
                                        src={`http://localhost:3000${item.ImagePath}`} 
                                        alt="" 
                                        className="w-12 h-12 object-cover rounded-xl border border-slate-50"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'} 
                                    />
                                    <div className="flex-1 text-left">
                                        <p className="text-[10px] font-black text-slate-800 line-clamp-1 italic uppercase tracking-tighter">{item.ProductName}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Size: {item.SizeName} | Qty: {item.Quantity}</p>
                                    </div>
                                    <p className="text-xs font-black text-slate-900">{Number(item.Price).toLocaleString()}đ</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-6 border-t border-dashed border-slate-200 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase italic">Total Payment</span>
                            <span className="text-2xl font-black text-blue-600 tracking-tighter italic">{Number(order.TotalPrice).toLocaleString()}đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};