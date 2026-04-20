import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, X, Box } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) { toast.error('Failed to load products'); }
  };

  const filteredProducts = products.filter(p =>
    (p.Name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 mt-0 py-2">
        <div><h1 className="text-2xl font-black text-slate-800">Product Management</h1></div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg"><Plus size={18} className="inline mr-2" /> Add New</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 mb-6 flex items-center gap-3">
        <Search className="text-slate-400 ml-2" size={20} />
        <input placeholder="Search..." className="w-full outline-none text-sm font-medium" onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase font-bold">
            <tr><th className="px-8 py-4">Image</th><th className="px-8 py-4">Name</th><th className="px-8 py-4">Price</th><th className="px-8 py-4 text-center">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {filteredProducts.map(p => (
              <tr key={p.ProductID} className="hover:bg-slate-50/30">
                <td className="px-8 py-4"><img src={p.Image} className="w-10 h-10 object-cover rounded-lg border" /></td>
                <td className="px-8 py-4 font-bold text-slate-700">{p.Name}</td>
                <td className="px-8 py-4 font-black">${Number(p.Price || 0).toFixed(2)}</td>
                <td className="px-8 py-4 flex justify-center gap-2">
                  <button className="text-slate-400 hover:text-blue-600 p-2"><Edit3 size={18} /></button>
                  <button className="text-slate-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};