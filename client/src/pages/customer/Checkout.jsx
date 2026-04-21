import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // QUAN TRỌNG: Đã thêm useLocation
import { ShoppingBag, MapPin, Phone, User, CreditCard, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    // 1. NHẬN SẢN PHẨM & TỔNG TIỀN TỪ TRANG CART TRUYỀN SANG (Không dùng localStorage nữa)
    const { selectedItems, totalPrice } = location.state || { selectedItems: [], totalPrice: 0 };
    
    // 2. Lấy thông tin tài khoản đăng nhập
    const userLocal = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false);

    // 3. State chứa thông tin đầy đủ của khách hàng (lấy từ DB)
    const [fullUser, setFullUser] = useState(null);

    // 4. LOGIC TÌM TÊN KHÁCH HÀNG (Đã chạy thành công)
    useEffect(() => {
        const getCustomerInfo = async () => {
            if (!userLocal) return;
            try {
                const res = await axios.get('http://localhost:3000/api/auth/users');
                const currentUser = res.data.find(u => u.UserID === userLocal.id || u.id === userLocal.id);
                if (currentUser) {
                    setFullUser(currentUser);
                }
            } catch (error) {
                console.error("Lỗi bốc dữ liệu khách hàng:", error);
            }
        };
        getCustomerInfo();
    }, []);

    const handlePlaceOrder = async () => {
        if (!userLocal) {
            toast.error("Please login to place an order");
            return;
        }

        if (!selectedItems || selectedItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                UserID: userLocal.id || userLocal.UserID,
                TotalPrice: totalPrice
            };

            const res = await axios.post('http://localhost:3000/api/orders/checkout', orderData);

            if (res.status === 201) {
                toast.success("Order placed successfully!");
                navigate('/order-history'); 
            }
        } catch (error) {
            console.error("Checkout Error:", error);
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
                <ArrowLeft size={14}/> Back to cart
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
                                    <p className="text-sm font-black text-slate-800 uppercase italic">
                                        {fullUser?.Name || fullUser?.CustomerName || fullUser?.name || 'ĐANG TẢI...'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                    <Phone size={20}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                                    <p className="text-sm font-black text-slate-800 tracking-tighter">
                                        {fullUser?.Phone || fullUser?.CustomerPhone || fullUser?.phone || 'Đang tải...'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                    <MapPin size={20}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                    <p className="text-sm font-black text-slate-800 leading-relaxed italic">
                                        {fullUser?.Address || fullUser?.CustomerAddress || fullUser?.address || 'Đang tải...'}
                                    </p>
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
                                    <p className="text-[10px] text-blue-400 font-bold uppercase mt-1 tracking-widest text-left">Pay in cash when you receive the items</p>
                                </div>
                            </div>
                            <CheckCircle className="text-blue-600" size={28}/>
                        </div>
                    </section>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-[#0F172A] rounded-[3.5rem] p-10 text-white sticky top-10 shadow-2xl shadow-blue-100/20">
                        <h3 className="text-xl font-black italic uppercase mb-10 border-b border-slate-800 pb-6 tracking-tighter text-left">Order Summary</h3>
                        
                        <div className="space-y-6 mb-12 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
                            {/* QUAN TRỌNG: Map qua selectedItems thay vì cartItems */}
                            {selectedItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-slate-800 rounded-2xl overflow-hidden shrink-0 border border-slate-700 p-1">
                                        <img src={`http://localhost:3000${item.Image || item.ImagePath}`} alt="" className="w-full h-full object-cover rounded-xl" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-[10px] font-black uppercase leading-tight line-clamp-1 italic text-slate-100">{item.ProductName}</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Size {item.SizeName} • Qty {item.Quantity}</p>
                                    </div>
                                    <p className="text-xs font-black tracking-tighter text-blue-400">{(item.Price * item.Quantity).toLocaleString()}đ</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-5 border-t border-slate-800 pt-10 mb-10">
                            <div className="flex justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span>Subtotal</span>
                                <span className="text-slate-100 font-bold">{totalPrice.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span>Shipping Fee</span>
                                <span className="text-emerald-400 font-black italic">FREE</span>
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
                                : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.03] shadow-2xl shadow-blue-900/40 active:scale-95'
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