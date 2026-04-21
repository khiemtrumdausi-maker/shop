import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, PackageOpen, TrendingUp, Trophy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const AdminDashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]); // State mới cho Top Selling

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Gọi API lấy Đơn hàng
        const ordersRes = await axios.get('http://localhost:3000/api/orders');
        let ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.data || []);

        setTotalOrders(ordersData.length);

        const deliveredOrders = ordersData.filter(o => {
             const stt = String(o.Status).toLowerCase(); 
             return stt === 'delivered' || stt === 'completed'; 
        });

        const revenue = deliveredOrders.reduce((sum, o) => sum + Number(o.TotalPrice || 0), 0);
        setTotalRevenue(revenue);

        // XỬ LÝ BIỂU ĐỒ (Đã fix lỗi lật ngược)
        const revenueByDate = {};
        deliveredOrders.forEach(order => {
            const dateObj = new Date(order.OrderDate || order.PaymentDate || new Date());
            const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`; 
            revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + Number(order.TotalPrice || 0);
        });

        let formattedChartData = Object.keys(revenueByDate).map(date => ({
            name: date,
            DoanhThu: revenueByDate[date]
        }));

        // Sắp xếp ngày tháng từ Nhỏ -> Lớn (Cũ -> Mới) để biểu đồ chuẩn chiều
        formattedChartData.sort((a, b) => {
            const [dayA, monthA] = a.name.split('/').map(Number);
            const [dayB, monthB] = b.name.split('/').map(Number);
            return monthA === monthB ? dayA - dayB : monthA - monthB;
        });

        if (formattedChartData.length === 0) {
            formattedChartData = [ { name: 'T2', DoanhThu: 0 }, { name: 'T3', DoanhThu: 0 } ];
        }
        setChartData(formattedChartData);

        // 2. Lấy số Khách hàng
        try {
          const usersRes = await axios.get('http://localhost:3000/api/auth/users');
          const usersData = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || []);
          setTotalCustomers(usersData.length);
        } catch (e) {}

        // 3. Lấy số Sản phẩm
        try {
          const productsRes = await axios.get('http://localhost:3000/api/products');
          const productsData = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []);
          const totalStock = productsData.reduce((sum, p) => sum + (Number(p.Stock) || 0), 0);
          setTotalProducts(totalStock > 0 ? totalStock : productsData.length);
        } catch (e) {}

        // 4. Gọi API Lấy Top Selling (Dữ liệu thật)
        try {
          const topRes = await axios.get('http://localhost:3000/api/orders/top-selling');
          setTopProducts(Array.isArray(topRes.data) ? topRes.data : []);
        } catch (e) {
          console.error('Chưa có API Top Selling hoặc lỗi bốc dữ liệu:', e);
        }

      } catch (error) {
        console.error('Lỗi khi bốc dữ liệu Dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'REVENUE', value: `${totalRevenue.toLocaleString()}đ`, icon: <DollarSign size={20} />, color: 'bg-emerald-500' },
    { title: 'ORDERS', value: totalOrders.toString(), icon: <ShoppingCart size={20} />, color: 'bg-blue-500' },
    { title: 'CUSTOMERS', value: totalCustomers.toString(), icon: <Users size={20} />, color: 'bg-violet-500' },
    { title: 'TOTAL PRODUCTS', value: totalProducts.toString(), icon: <PackageOpen size={20} />, color: 'bg-rose-500' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F172A] p-4 rounded-2xl shadow-xl border border-slate-700">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Ngày {label}</p>
          <p className="text-emerald-400 font-black text-lg">{payload[0].value.toLocaleString()}đ</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full font-sans">
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Overview</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Dashboard Control Panel</p>
      </div>

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
        
        {/* BIỂU ĐỒ DOANH THU */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden p-7">
          <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <TrendingUp className="text-emerald-500" size={20}/> Revenue Analytics
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-1">Doanh thu theo ngày (Đơn đã giao)</p>
            </div>
          </div>
          
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="DoanhThu" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BẢNG SẢN PHẨM BÁN CHẠY (DỮ LIỆU THẬT) */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-7">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Trophy className="text-orange-500" size={20}/> Top Selling
            </h2>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">See All</button>
          </div>
          
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden p-1 shadow-inner">
                    <img src={`http://localhost:3000${prod.Image}`} alt={prod.ProductName} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800 line-clamp-1 uppercase italic">{prod.ProductName}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Đã bán: {prod.TotalSold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-500">{(Number(prod.TotalRevenue)).toLocaleString()}đ</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 text-xs py-10 font-bold italic">Chưa có dữ liệu bán hàng</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};