import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, X, Box, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    ProductName: '',
    Description: '',
    Price: '',
    Image: '',
    CategoryID: '1' // Mặc định là T-Shirts
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to load products from database');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `http://localhost:3000/api/products/${editingProduct.ProductID}`
        : 'http://localhost:3000/api/products';
      const method = editingProduct ? 'put' : 'post';

      await axios[method](url, {
        ...formData,
        Price: parseFloat(formData.Price),
        CategoryID: parseInt(formData.CategoryID)
      });

      toast.success(editingProduct ? 'Product updated!' : 'Product added!');
      loadProducts();
      closeModal();
    } catch (error) {
      toast.error('Action failed. Check backend console.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      toast.success('Deleted!');
      loadProducts();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ProductName: product.ProductName || '',
        Description: product.Description || '',
        Price: product.Price?.toString() || '',
        Image: product.Image || '',
        CategoryID: product.CategoryID?.toString() || '1'
      });
    } else {
      setEditingProduct(null);
      setFormData({ ProductName: '', Description: '', Price: '', Image: '', CategoryID: '1' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p =>
    (p.ProductName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.CategoryName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 mt-0 py-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Product Management</h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Inventory & Catalog</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold text-sm"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 mb-6 flex items-center gap-3">
        <Search className="text-slate-400 ml-2" size={20} />
        <input
          type="text"
          placeholder="Search by name or category..."
          className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden font-sans">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-8 py-4">Image</th>
              <th className="px-8 py-4">Name</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4">Price</th>
              <th className="px-8 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {filteredProducts.map((product) => (
              <tr key={product.ProductID} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-4">
                  <img src={product.Image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
                </td>
                <td className="px-8 py-4 font-bold text-slate-700">{product.ProductName}</td>
                <td className="px-8 py-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase border border-blue-100">
                    {/* Hiển thị CategoryName từ lệnh JOIN ở Backend */}
                    {product.CategoryName || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-8 py-4 font-black text-slate-900">${Number(product.Price || 0).toFixed(2)}</td>
                <td className="px-8 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.ProductID)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-300">
            <Box size={48} strokeWidth={1} />
            <p className="text-sm font-medium">No products found.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-lg font-black text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-900">
              <input 
                placeholder="Product Name" 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.ProductName}
                onChange={(e) => setFormData({ ...formData, ProductName: e.target.value })}
                required
              />
              <textarea 
                placeholder="Description" rows={3}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" step="0.01" placeholder="Price ($)" 
                  className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.Price}
                  onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                  required
                />
                <select 
                  className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  value={formData.CategoryID}
                  onChange={(e) => setFormData({ ...formData, CategoryID: e.target.value })}
                  required
                >
                  <option value="1">T-Shirts</option>
                  <option value="2">Jeans</option>
                  <option value="3">Jackets</option>
                  <option value="4">Hoodies</option>
                  <option value="5">Sweaters</option>
                  <option value="6">Accessories</option>
                </select>
              </div>
              <input 
                placeholder="Image URL" 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Image}
                onChange={(e) => setFormData({ ...formData, Image: e.target.value })}
                required
              />
              <div className="flex gap-3 pt-4 border-t border-slate-50 mt-6">
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};