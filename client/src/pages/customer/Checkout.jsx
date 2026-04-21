import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, MapPin, Phone, User, CreditCard, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    // 1. LẤY DỮ LIỆU TRUYỀN SANG (Từ Shop hoặc Cart)
    const [selectedItems, setSelectedItems] = useState(location.state?.selectedItems || []);
    const [totalPrice, setTotalPrice] = useState(location.state?.totalPrice || 0);
    const isBuyNow = location.state?.isBuyNow || false; // Cờ đánh dấu Mua Ngay

    const userLocal = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false);
    const [fullUser, setFullUser] = useState(null);

    useEffect(() => {
        if (!userLocal) {
            navigate('/login');
            return;
        }

        // 2. LOGIC PHÂN BIỆT: 
        // Nếu không có dữ liệu truyền sang VÀ không phải lệnh Buy Now thì mới load giỏ hàng từ DB
        if (selectedItems.length === 0 && !isBuyNow) {
            loadCartFromDB();
        }
        getCustomerInfo();
    }, [location.state]);

    const loadCartFromDB = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/cart/${userLocal.id || userLocal.UserID}`);
            if (res.data.length > 0) {
                setSelectedItems(res.data);
                const total = res.data.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
                setTotalPrice(total);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu giỏ hàng:", error);
        }
    };

    const getCustomerInfo = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/auth/users');
            const currentUser = res.data.find(u => u.UserID === userLocal.id || u.id === userLocal.id);
            if (currentUser) setFullUser(currentUser);
        } catch (error) {
            console.error("Lỗi bốc dữ liệu khách hàng:", error);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedItems || selectedItems.length === 0) {
            toast.error("Your order is empty");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                UserID: userLocal.id || userLocal.UserID,
                TotalPrice: totalPrice,
                // Nếu là Mua Ngay thì gửi items sang để Backend không xóa giỏ hàng
                items: isBuyNow ? selectedItems : null 
            };

            const res = await axios.post('http://localhost:3000/api/orders/checkout', orderData);

            if (res.status === 201) {
                toast.success("Order placed successfully!");
                window.dispatchEvent(new Event('cartUpdated')); 
                navigate('/order-history'); 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen bg-white font-sans text-left">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-10 transition-all"
            >
                <ArrowLeft size={14}/> Back
            </button>

            <div className="grid md:grid-cols-3 gap-16">
                <div className="md:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 italic uppercase mb-8 flex items-center gap-3">
                            <MapPin className="text-blue-600" size={24} /> Shipping Information
                        </h2>
                        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                    <User size={20}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receiver Name</p>
                                    <p className="text-sm font-black text-slate-800 uppercase italic">{fullUser?.Name || 'LOADING...'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                    <Phone size={20}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                                    <p className="text-sm font-black text-slate-800">{fullUser?.Phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                    <MapPin size={20}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                    <p className="text-sm font-black text-slate-800 italic">{fullUser?.Address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 italic uppercase mb-8 flex items-center gap-3">
                            <CreditCard className="text-blue-600" size={24} /> Payment Method
                        </h2>
                        <div className="bg-blue-50/50 border-2 border-blue-100 p-8 rounded-[2.5rem] flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <ShoppingBag size={24}/>
                                </div>
                                <div>
                                    <p className="font-black text-blue-900 text-sm uppercase italic">Cash on Delivery (COD)</p>
                                    <p className="text-[10px] text-blue-400 font-bold uppercase mt-1">Pay in cash when you receive the items</p>
                                </div>
                            </div>
                            <CheckCircle className="text-blue-600" size={28}/>
                        </div>
                    </section>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-[#0F172A] rounded-[3.5rem] p-10 text-white sticky top-10 shadow-2xl">
                        <h3 className="text-xl font-black italic uppercase mb-10 border-b border-slate-800 pb-6 tracking-tighter">Order Summary</h3>
                        
                        <div className="space-y-6 mb-12 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
                            {selectedItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-slate-800 rounded-2xl overflow-hidden shrink-0 border border-slate-700 p-1">
                                        <img src={item.Image?.startsWith('http') ? item.Image : `http://localhost:3000${item.Image || item.ImagePath}`} alt="" className="w-full h-full object-cover rounded-xl" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-[10px] font-black uppercase leading-tight line-clamp-1 italic text-slate-100">{item.ProductName}</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Size {item.SizeName} • Qty {item.Quantity}</p>
                                    </div>
                                    <p className="text-xs font-black text-blue-400">{(item.Price * item.Quantity).toLocaleString()}đ</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-5 border-t border-slate-800 pt-10 mb-10">
                            <div className="flex justify-between items-center text-slate-500 text-[10px] font-black uppercase">
                                <span>Subtotal</span>
                                <span className="text-slate-100 font-bold">{totalPrice.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between items-center pt-6">
                                <span className="text-sm font-black uppercase italic text-slate-300">Grand Total</span>
                                <span className="text-4xl font-black tracking-tighter text-blue-500 italic">
                                    {totalPrice.toLocaleString()}đ
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={loading || selectedItems.length === 0}
                            className={`w-full py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 italic ${
                                loading || selectedItems.length === 0
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.03] shadow-2xl'
                            }`}
                        >
                            {loading ? 'PROCESSING...' : 'PLACE ORDER'} <ChevronRight size={18}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};