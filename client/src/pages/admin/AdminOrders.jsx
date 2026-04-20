import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) { toast.error('Failed to load orders'); }
  };

  return (
    <div className="w-full">
      <div className="mb-6 mt-0 py-2"><h1 className="text-2xl font-black text-slate-800">Order Management</h1></div>
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold">
            <tr><th className="px-8 py-4">ID</th><th className="px-8 py-4">Date</th><th className="px-8 py-4">Total</th><th className="px-8 py-4">Status</th><th className="px-8 py-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map(order => (
              <tr key={order.OrderID}>
                <td className="px-8 py-4 font-mono text-xs">#ORD-{order.OrderID}</td>
                <td className="px-8 py-4">{new Date(order.OrderDate).toLocaleDateString()}</td>
                <td className="px-8 py-4 font-black">${Number(order.TotalPrice || 0).toFixed(2)}</td>
                <td className="px-8 py-4">{order.Status}</td>
                <td className="px-8 py-4"><button className="text-blue-600"><Eye size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};