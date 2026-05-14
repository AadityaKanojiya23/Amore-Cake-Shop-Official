'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, ShieldCheck, ChevronRight, Eye, Trash, Plus, Check, Clock, 
  BarChart3, ShoppingBag, Package, TrendingUp, Search, Calendar, User, Info, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { 
    user, products, orders, updateOrderStatus, adminMetrics, addProduct, deleteProduct, showToast, isBackendOnline 
  } = useApp();
 
  const router = useRouter();

  // Tab state: analytics, orders, products
  const [activeTab, setActiveTab] = useState('analytics');

  // Search/Filters states
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // CRUD MODAL states
  const [showProductModal, setShowProductModal] = useState(false);

  // New product form details
  const [prodName, setProdName] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState(499);
  const [prodDiscountPrice, setProdDiscountPrice] = useState(399);
  const [prodCategory, setProdCategory] = useState('chocolate-cakes');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=350');
  const [prodIsPremium, setProdIsPremium] = useState(false);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsTrending, setProdIsTrending] = useState(false);

  // Restrict access if not admin
  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (user.role !== 'admin') {
      showToast('Access Denied. Admin privilege required.', 'error');
      router.push('/dashboard');
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex-grow flex items-center justify-center py-24 bg-background text-navy">
        <span className="font-sans font-medium animate-pulse uppercase tracking-wider text-xs">Verifying Credentials...</span>
      </div>
    );
  }

  // Handle Product Addition
  const handleAddNewProductSubmit = async (e) => {
    e.preventDefault();
    if (!prodName || !prodDescription || !prodPrice) return;

    const prodPayload = {
      name: prodName,
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: prodDescription,
      longDescription: `An artisanal crafted ${prodName} curated specifically using organic ingredients and baked fresh in our central boutique kitchen. Recommended for celebrations.`,
      price: Number(prodPrice),
      discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
      category: prodCategory,
      images: [prodImage],
      weights: ['0.5kg', '1.0kg', '1.5kg'],
      flavors: ['Classic Filling', 'Double Chocolate Shavings'],
      rating: 4.8,
      reviewsCount: 1,
      isEgglessOption: true,
      ingredients: ['Premium Cocoa Flour', 'Yogurt', 'Vanilla bean extraction'],
      tags: [prodCategory, 'eggless', 'fresh-baked'],
      isFeatured: true,
      isPremium: prodIsPremium,
      isBestSeller: prodIsBestSeller,
      isTrending: prodIsTrending,
      isActive: true
    };

    const success = await addProduct(prodPayload);
    if (success) {
      setShowProductModal(false);
      // Reset forms
      setProdName('');
      setProdDescription('');
      setProdPrice(499);
      setProdDiscountPrice(399);
      setProdCategory('chocolate-cakes');
      setProdIsPremium(false);
      setProdIsBestSeller(false);
      setProdIsTrending(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      showToast(`Order status updated to ${newStatus}`, 'success');
    }
  };

  // Filter lists in memory
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.invoiceNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.shippingAddress.name.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-background text-foreground animate-fade-in">
      
      {/* Admin Jumbotron header */}
      <div className="bg-navy-dark text-white p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden border-b-4 border-orange">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange/5 rounded-full blur-2xl"></div>
        <div className="flex gap-4 items-center text-center md:text-left">
          <div className="bg-orange/15 border border-orange/30 p-3 rounded-2xl text-orange shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-white">Central Operations Desk</h1>
            <p className="text-xs text-white/70 font-normal">Active: <span className="text-success font-medium uppercase tracking-wider">{isBackendOnline ? 'LIVE SERVER ROUTING' : 'OFFLINE SHADOW STATE'}</span> | Total registered catalog: {products.length} products</p>
          </div>
        </div>

        {/* Tab Navigation buttons */}
        <div className="flex gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/5 font-medium text-xs shrink-0">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-4 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-orange text-white shadow-md' : 'hover:bg-white/5 text-white/80'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-orange text-white shadow-md' : 'hover:bg-white/5 text-white/80'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 rounded-xl transition-all ${activeTab === 'products' ? 'bg-orange text-white shadow-md' : 'hover:bg-white/5 text-white/80'}`}
          >
            Products
          </button>
        </div>
      </div>

      {/* TAB 1: OPERATIVE ANALYTICS */}
      {activeTab === 'analytics' && adminMetrics && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Metrics grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard title="Monthly Gross Revenue" value={`₹${adminMetrics.totalRevenue}`} subtitle="Total cleared order values" icon={<TrendingUp className="w-6 h-6 text-success" />} />
            <MetricsCard title="Total Orders Placed" value={adminMetrics.totalOrdersCount} subtitle="Custom orders recorded" icon={<ShoppingBag className="w-6 h-6 text-orange" />} />
            <MetricsCard title="Average Transaction" value={`₹${adminMetrics.avgOrderVal}`} subtitle="Basket value statistics" icon={<Package className="w-6 h-6 text-navy" />} />
            <MetricsCard title="Active In-oven Bookings" value={orders.filter(o => ['Confirmed', 'Baking'].includes(o.status)).length} subtitle="Fresh cakes preparing" icon={<Sparkles className="w-6 h-6 text-orange animate-pulse" />} />
          </div>

          {/* Graphical representation simulation & Statuses percentages lists */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-navy font-medium">
            
            {/* Visual graph layout */}
            <div className="lg:col-span-8 bg-card-bg border border-border-color p-6 rounded-[28px] shadow-md space-y-4">
              <h3 className="font-serif font-medium text-navy text-base flex items-center gap-1.5"><BarChart3 className="w-5 h-5 text-orange" /> Weekly Sales Performance</h3>
              <div className="h-52 flex items-end justify-between gap-4 pt-6 border-b border-border-color pb-2 relative">
                <GraphBar label="Mon" height="40%" val="₹18.5k" />
                <GraphBar label="Tue" height="55%" val="₹24.8k" />
                <GraphBar label="Wed" height="48%" val="₹21.2k" />
                <GraphBar label="Thu" height="75%" val="₹35.4k" />
                <GraphBar label="Fri" height="92%" val="₹48.9k" />
                <GraphBar label="Sat" height="98%" val="₹52.0k" />
                <GraphBar label="Sun" height="85%" val="₹42.5k" />
              </div>
            </div>

            {/* Popular category breakdown lists */}
            <div className="lg:col-span-4 bg-card-bg border border-border-color p-6 rounded-[28px] shadow-md space-y-4">
              <h3 className="font-serif font-medium text-navy text-base">Category Demand Ratios</h3>
              <div className="space-y-3.5 text-xs font-normal text-navy">
                <CategoryBar label="Chocolate Heaven" percent={45} color="bg-orange" />
                <CategoryBar label="Wedding Specials" percent={22} color="bg-gold" />
                <CategoryBar label="Cupcakes" percent={18} color="bg-orange-hover" />
                <CategoryBar label="Fruit Confectioneries" percent={15} color="bg-navy" />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ACTIVE ORDER STATUS SWITCHBOARD MODULE */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Subheader Search bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card-bg border border-border-color p-4 rounded-2xl shadow-sm text-xs font-medium text-navy">
            <div className="flex items-center border border-border-color bg-cream py-1.5 px-3 rounded-xl w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-navy/40 mr-1.5" />
              <input 
                type="text" placeholder="Search by Invoice or Name..."
                value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-navy font-medium"
              />
            </div>
            <span>Manage active status progression dials below</span>
          </div>

          {/* Detailed tabular layouts of orders */}
          <div className="bg-card-bg border border-border-color rounded-[28px] shadow-md overflow-hidden text-navy">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs font-normal">
                <thead>
                  <tr className="bg-cream border-b border-border-color text-navy/55 uppercase font-medium text-[10px]">
                    <th className="p-4">Invoice / Client details</th>
                    <th className="p-4">Delivery scheduled</th>
                    <th className="p-4">Price breakdowns</th>
                    <th className="p-4">Custom Cake instructions</th>
                    <th className="p-4">Operation Status switch</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-navy/40 italic font-medium">No checkout records match.</td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order._id} className="border-b border-border-color hover:bg-cream/40">
                        <td className="p-4 space-y-1">
                          <p className="font-serif font-medium text-sm text-navy">{order.invoiceNumber}</p>
                          <p className="text-[10px] text-navy/55 font-medium flex items-center gap-1"><User className="w-3.5 h-3.5 text-orange" /> {order.shippingAddress.name} ({order.shippingAddress.phone})</p>
                        </td>
                        <td className="p-4 text-[10px] space-y-0.5">
                          <p className="font-medium flex items-center gap-1 text-navy"><Calendar className="w-3.5 h-3.5 text-orange" /> {order.deliveryDetails.date}</p>
                          <p className="text-navy/55 font-normal">Slot: {order.deliveryDetails.timeSlot}</p>
                        </td>
                        <td className="p-4 space-y-0.5">
                          <p className="text-sm font-medium text-orange">₹{order.pricing.totalAmount}</p>
                          <p className="text-[10px] text-navy/55 font-normal">Method: {order.payment.method} ({order.payment.status})</p>
                        </td>
                        <td className="p-4 text-[10px] max-w-xs leading-normal">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="border-b border-border-color/40 pb-1 mb-1 last:border-none last:pb-0 last:mb-0">
                              <p className="font-medium text-navy">{it.name} ({it.weight} | {it.flavor})</p>
                              {it.cakeMessage && <p className="italic text-navy/65 font-medium">Msg: &quot;{it.cakeMessage}&quot;</p>}
                              {it.isEggless && <p className="text-success font-medium text-[9px]">100% EGGLESS RECIPE</p>}
                            </div>
                          ))}
                        </td>
                        <td className="p-4">
                          {order.status === 'Cancelled' ? (
                            <span className="text-red-500 bg-red-50 border border-red-100 text-[10px] uppercase font-medium px-2.5 py-1 rounded-full">Cancelled</span>
                          ) : order.status === 'Delivered' ? (
                            <span className="text-success bg-success/10 border border-success/20 text-[10px] uppercase font-medium px-2.5 py-1 rounded-full flex items-center gap-1 max-w-[95px]"><Check className="w-3.5 h-3.5" /> Delivered</span>
                          ) : (
                            <select 
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="text-xs font-medium p-1.5 border border-border-color bg-card-bg text-navy rounded-lg outline-none focus:ring-1 focus:ring-orange cursor-pointer"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Baking">Baking</option>
                              <option value="Packed">Quality Sealed</option>
                              <option value="Out for delivery">Out for dispatch</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PRODUCTS CATALOG CRUD LISTS */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Subheader action bars */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card-bg border border-border-color p-4 rounded-2xl shadow-sm text-xs font-medium text-navy">
            <div className="flex items-center border border-border-color bg-cream py-1.5 px-3 rounded-xl w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-navy/40 mr-1.5" />
              <input 
                type="text" placeholder="Search catalog by name/slug..."
                value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-navy font-medium"
              />
            </div>
            <button 
              onClick={() => setShowProductModal(true)}
              className="bg-orange hover:bg-orange-hover text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-1.5 uppercase shrink-0 hover:scale-102"
            >
              <Plus className="w-4 h-4" /> Add New Confectionery
            </button>
          </div>

          {/* Grid list showing product logs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map(prod => (
              <div 
                key={prod._id}
                className="bg-card-bg border border-border-color rounded-3xl p-4 flex flex-col justify-between hover:border-orange amore-card shadow-sm group relative overflow-hidden transition-all duration-300"
              >
                {/* Delete button */}
                <button 
                  onClick={() => { if (confirm(`Remove ${prod.name} from public store catalog?`)) deleteProduct(prod._id); }}
                  className="absolute top-4 right-4 p-1.5 bg-card-bg hover:bg-red-50 text-navy/30 hover:text-red-500 rounded-full border border-border-color transition-colors z-20 shadow-sm"
                  title="Remove from store"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-3">
                  <img src={prod.images[0]} alt={prod.name} className="w-full h-36 object-cover rounded-2xl border border-border-color" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-medium uppercase tracking-wider text-navy/50">{prod.category.replace('-', ' ')}</span>
                    <h3 className="font-serif font-medium text-navy text-sm truncate leading-tight group-hover:text-orange transition-colors">{prod.name}</h3>
                    <p className="text-orange font-medium text-sm">₹{prod.discountPrice || prod.price}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-color mt-3 flex justify-between text-[10px] text-navy/40 font-medium">
                  <span>Rating: {prod.rating}</span>
                  <span>Orders: {prod.reviewsCount}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* DETAILED CRUD INJECTION POPUP MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleAddNewProductSubmit}
            className="bg-card-bg border border-border-color rounded-[32px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-5 shadow-2xl relative text-navy font-medium animate-float"
          >
            <button type="button" onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 p-1 hover:bg-cream rounded-full text-navy"><X className="w-5 h-5" /></button>
            <h2 className="font-serif font-medium text-navy text-xl border-b border-border-color pb-2.5 flex items-center gap-1.5">
              <Package className="w-5 h-5 text-orange" /> Inject Catalog Recipe
            </h2>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-medium text-navy/50">Product Name</label>
              <input 
                type="text" required placeholder="E.g. Royal Gold Velvet"
                value={prodName} onChange={(e) => setProdName(e.target.value)}
                className="w-full text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-medium text-navy/50">Short description</label>
              <textarea 
                required rows={2} placeholder="Ingredients details, textures, and decorative pipings details..."
                value={prodDescription} onChange={(e) => setProdDescription(e.target.value)}
                className="w-full text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-medium text-navy/50">Catalog Base Price (₹)</label>
                <input 
                  type="number" required
                  value={prodPrice} onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full text-xs font-medium p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-medium text-navy/50">Promo Discount Price (₹)</label>
                <input 
                  type="number" required
                  value={prodDiscountPrice} onChange={(e) => setProdDiscountPrice(Number(e.target.value))}
                  className="w-full text-xs font-medium p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-medium text-navy/50">Product Image URL</label>
              <input 
                type="text" required
                value={prodImage} onChange={(e) => setProdImage(e.target.value)}
                className="w-full text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-medium text-navy/50">Bake category</label>
                <select 
                  value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full p-2 bg-background border border-border-color rounded-xl text-navy font-medium text-xs cursor-pointer outline-none focus:ring-1 focus:ring-orange"
                >
                  <option value="chocolate-cakes">Chocolate Heaven</option>
                  <option value="premium-cakes">Luxury Aura Cakes</option>
                  <option value="birthday-cakes">Birthday Cakes</option>
                  <option value="wedding-cakes">Wedding Specials</option>
                  <option value="cupcakes">Cupcakes</option>
                  <option value="pastries">Sliced Pastries</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-1 pt-4 font-normal text-navy">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={prodIsPremium} onChange={(e) => setProdIsPremium(e.target.checked)} className="accent-orange" />
                  <span>Is Elite Premium</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={prodIsBestSeller} onChange={(e) => setProdIsBestSeller(e.target.checked)} className="accent-orange" />
                  <span>Is Best Seller</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={prodIsTrending} onChange={(e) => setProdIsTrending(e.target.checked)} className="accent-orange" />
                  <span>Is Trending</span>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-orange hover:bg-orange-hover text-white font-medium py-3 rounded-2xl text-xs transition-all shadow-lg uppercase"
            >
              Add Product to Store Catalog
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

// SIMULATED METRICS CARD COMPONENT
function MetricsCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-card-bg border border-border-color rounded-[28px] p-6 flex justify-between items-center shadow-md text-navy">
      <div className="space-y-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-navy/45">{title}</span>
        <h3 className="text-2xl font-serif font-medium text-navy leading-none">{value}</h3>
        <p className="text-[10px] text-navy/50 font-normal">{subtitle}</p>
      </div>
      <div className="bg-cream p-3 rounded-2xl shrink-0">
        {icon}
      </div>
    </div>
  );
}

// GRAPH COMPONET UTILITY
function GraphBar({ label, height, val }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
      <span className="opacity-0 group-hover:opacity-100 bg-navy text-white text-[9px] font-medium py-0.5 px-1.5 rounded transition-opacity absolute mb-38 shrink-0">{val}</span>
      <div className="w-full bg-orange/10 rounded-t-xl hover:bg-orange transition-all duration-500 cursor-pointer relative" style={{ height: height }}></div>
      <span className="text-[10px] font-medium text-navy/55 uppercase">{label}</span>
    </div>
  );
}

// POPULAR CATEGORY PROGRESS GRAPH
function CategoryBar({ label, percent, color }) {
  return (
    <div className="space-y-1 text-navy">
      <div className="flex justify-between text-[11px] font-medium">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-2.5 bg-cream border border-border-color rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
