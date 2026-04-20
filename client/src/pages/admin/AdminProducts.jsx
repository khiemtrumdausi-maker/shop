import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, X, Box, Upload } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    ProductName: '',
    Description: '',
    Price: '',
    CategoryID: '',
    Gender: 'Unisex',
    Status: 'Active'
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) { toast.error('Failed to load products'); }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories');
      setCategories(response.data);
      if (response.data.length > 0 && !editingProduct) {
        setFormData(prev => ({ ...prev, CategoryID: response.data[0].CategoryID }));
      }
    } catch (error) { console.error("Error loading categories"); }
  };

  const handleFileChange = (e) => { setSelectedFile(e.target.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('ProductName', formData.ProductName);
      data.append('Description', formData.Description);
      data.append('Price', formData.Price);
      data.append('CategoryID', formData.CategoryID);
      data.append('Gender', formData.Gender);
      data.append('Status', formData.Status);
      if (selectedFile) data.append('Image', selectedFile);

      const url = editingProduct 
        ? `http://localhost:3000/api/products/${editingProduct.ProductID}`
        : 'http://localhost:3000/api/products';
      
      const method = editingProduct ? 'put' : 'post';

      await axios({
        method: method,
        url: url,
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(editingProduct ? 'Product updated!' : 'Product added successfully!');
      loadProducts();
      closeModal();
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      toast.success('Product deleted!');
      loadProducts();
    } catch (error) { toast.error('Delete failed'); }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ProductName: product.ProductName,
        Description: product.Description || '',
        Price: product.Price,
        CategoryID: product.CategoryID,
        Gender: product.Gender || 'Unisex',
        Status: product.Status || 'Active'
      });
    } else {
      setEditingProduct(null);
      setFormData({ 
        ProductName: '', 
        Description: '', 
        Price: '', 
        CategoryID: categories[0]?.CategoryID || '',
        Gender: 'Unisex',
        Status: 'Active'
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingProduct(null); };

  const filteredProducts = products.filter(p =>
    (p.ProductName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full font-sans">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Product Management</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Inventory & Catalog</p>
          </div>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all hover:scale-105">
            <Plus size={18} /> Add Product
          </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 mb-6 flex items-center gap-3">
        <Search className="text-slate-400 ml-2" size={20} />
        <input
          type="text"
          placeholder="Search by product name..."
          className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-5">ID</th> {/* Cột ID mới */}
              <th className="px-8 py-5">Product</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Price</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium">
            {filteredProducts.map((product) => (
              <tr key={product.ProductID} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-400">#{product.ProductID}</td> {/* Hiển thị ID */}
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.Image?.startsWith('http') ? product.Image : `http://localhost:3000${product.Image}`} 
                      className="w-12 h-12 object-cover rounded-xl border border-slate-100 shadow-sm" alt="" 
                    />
                    <div>
                        <p className="font-black text-slate-800 leading-tight mb-1">{product.ProductName}</p>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          product.Gender === 'Male' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                          product.Gender === 'Female' ? 'bg-pink-50 text-pink-500 border-pink-100' : 
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {product.Gender}
                        </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase">
                    {product.CategoryName || 'N/A'}
                  </span>
                </td>
                <td className="px-8 py-4 font-black text-slate-900">${Number(product.Price).toFixed(2)}</td>
                <td className="px-8 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                    product.Status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {product.Status}
                  </span>
                </td>
                <td className="px-8 py-4 text-center text-slate-400">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(product)} className="p-2 hover:text-blue-600 transition-all hover:bg-blue-50 rounded-xl"><Edit3 size={18}/></button>
                    <button onClick={() => handleDelete(product.ProductID)} className="p-2 hover:text-red-600 transition-all hover:bg-red-50 rounded-xl"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-300">
            <Box size={48} strokeWidth={1} />
            <p className="text-sm font-bold">No products found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden p-8 animate-in zoom-in duration-200">
            <h2 className="text-xl font-black mb-6 text-slate-800 text-center">{editingProduct ? 'UPDATE PRODUCT' : 'ADD NEW PRODUCT'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Product Name" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                value={formData.ProductName} onChange={e => setFormData({...formData, ProductName: e.target.value})} required 
              />
              <textarea 
                placeholder="Product description..." rows={2} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                value={formData.Description} onChange={e => setFormData({...formData, Description: e.target.value})} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="Price ($)" className="px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                  value={formData.Price} onChange={e => setFormData({...formData, Price: e.target.value})} required 
                />
                <select 
                  className="px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-500 outline-none"
                  value={formData.CategoryID} onChange={e => setFormData({...formData, CategoryID: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.CategoryID} value={cat.CategoryID}>{cat.CategoryName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-500 outline-none"
                  value={formData.Gender} onChange={e => setFormData({...formData, Gender: e.target.value})}
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select 
                  className="px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-500 outline-none"
                  value={formData.Status} onChange={e => setFormData({...formData, Status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-100 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-slate-300" />
                    <p className="text-[10px] text-slate-400 font-black uppercase">{selectedFile ? selectedFile.name : "Click to select image"}</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">SAVE PRODUCT</button>
                <button type="button" onClick={closeModal} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};