'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { 
  User, MapPin, ShoppingBag, Heart, ShieldCheck, Phone, Mail, 
  Trash, Edit, Download, RefreshCw, X, ChevronRight, Clock, Check, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { 
    user, token, orders, wishlist, products, deleteAddress, addAddress, cancelOrder, showToast, logout, loginWithGoogle
  } = useApp();

  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Load tracking details of first active order if exists
  useEffect(() => {
    if (orders && orders.length > 0 && !trackingOrder) {
      setTrackingOrder(orders[0]);
    }
  }, [orders]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrStreet || !addrCity || !addrState || !addrZip) return;

    const success = await addAddress({
      name: addrName,
      phone: addrPhone,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      zipCode: addrZip,
      isDefault: false
    });

    if (success) {
      setShowAddressForm(false);
      setAddrName('');
      setAddrPhone('');
      setAddrStreet('');
      setAddrCity('');
      setAddrState('');
      setAddrZip('');
    }
  };

  const handleCancelOrderSubmit = async (e) => {
    e.preventDefault();
    if (!trackingOrder) return;

    const success = await cancelOrder(trackingOrder._id, cancelReason);
    if (success) {
      setShowCancelModal(false);
      setCancelReason('');
      // Update tracking order local state reference
      const updated = orders.find(o => o._id === trackingOrder._id);
      if (updated) setTrackingOrder(updated);
    }
  };

  // If not logged in
  if (!user) {
    return (
      <div className="flex-grow max-w-xl mx-auto px-4 py-24 text-center space-y-6 bg-background text-foreground">
        <div className="text-5xl animate-pulse">🔒</div>
        <h1 className="font-serif font-medium text-2.5xl text-navy">Amore Cakes Profile Desk</h1>
        <p className="text-navy/70 text-sm font-normal leading-relaxed">To view address logbooks, access previous checkout invoices, or track active shipments, you must authorize your profile first.</p>
        <div className="pt-2">
          <button 
            onClick={() => loginWithGoogle()}
            className="bg-orange hover:bg-orange-hover text-white font-medium py-3.5 px-8 rounded-2xl text-xs transition-all shadow-md hover:scale-102 flex items-center gap-2 mx-auto uppercase"
          >
            Authorize Profile Logins
          </button>
        </div>
      </div>
    );
  }

  // Find wishlist products
  const wishlistProducts = products.filter(p => wishlist.includes(p._id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-background text-foreground animate-fade-in">
      
      {/* Profile Jumbotron */}
      <div className="bg-cream border border-border-color p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex gap-4 items-center flex-col md:flex-row text-center md:text-left">
          <img 
            src={user.avatar} 
            alt="avatar" 
            className="w-20 h-20 rounded-full border-4 border-orange object-cover shadow-md"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-medium text-navy">{user.name}</h1>
            <p className="text-xs text-navy/55 font-medium flex items-center justify-center md:justify-start gap-1"><Mail className="w-4 h-4 text-navy/40" /> {user.email}</p>
            <p className="text-[10px] bg-orange/15 text-orange border border-orange/20 rounded-full py-0.5 px-2.5 font-medium uppercase tracking-wider inline-block">VIP Shopper Profile</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="border border-red-200 hover:bg-red-50 text-red-500 font-medium py-2.5 px-6 rounded-2xl text-xs transition-colors"
        >
          Sign Out of Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Tabs Nav selectors */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-card-bg border border-border-color rounded-[28px] p-4 flex flex-col gap-1.5 shadow-md font-medium text-xs text-navy">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${activeTab === 'profile' ? 'bg-orange text-white shadow-sm' : 'hover:bg-cream text-navy'}`}
            >
              <User className="w-4 h-4 text-orange" /> Account Profile Settings
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${activeTab === 'addresses' ? 'bg-orange text-white shadow-sm' : 'hover:bg-cream text-navy'}`}
            >
              <MapPin className="w-4 h-4 text-orange" /> Saved Delivery Addresses
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${activeTab === 'orders' ? 'bg-orange text-white shadow-sm' : 'hover:bg-cream text-navy'}`}
            >
              <ShoppingBag className="w-4 h-4 text-orange" /> Order History & Invoices
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${activeTab === 'wishlist' ? 'bg-orange text-white shadow-sm' : 'hover:bg-cream text-navy'}`}
            >
              <Heart className="w-4 h-4 text-orange" /> Wishlisted cakes
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents panels */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: PROFILE OPTIONS */}
          {activeTab === 'profile' && (
            <div className="bg-card-bg border border-border-color rounded-[28px] p-6 space-y-4 shadow-md text-navy animate-fade-in">
              <h2 className="font-serif font-medium text-lg border-b border-border-color pb-2.5">Shopper Profile Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-normal">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-medium text-navy/50">Full Name</span>
                  <input type="text" defaultValue={user.name} disabled className="w-full p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy font-medium" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-medium text-navy/50">Email Credentials</span>
                  <input type="email" defaultValue={user.email} disabled className="w-full p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy font-medium" />
                </div>
              </div>
              <div className="text-[10px] text-navy/40 pt-2 border-t border-border-color flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-success" /> Account protected with Google SSO Authentication log.
              </div>
            </div>
          )}

          {/* TAB 2: ADDRESS MANAGEMENT */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-fade-in">
              
              {user.addresses && user.addresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div key={addr._id} className="bg-card-bg border border-border-color p-5 rounded-2xl relative shadow-sm text-navy">
                      <button 
                        onClick={() => deleteAddress(addr._id)}
                        className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-navy/30 hover:text-red-500 rounded-full transition-colors"
                        title="Delete Address"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <div className="flex gap-1.5 items-center text-xs font-serif font-medium text-navy">
                        <span className="text-sm">{addr.name}</span>
                        {addr.isDefault && <span className="bg-orange/15 text-orange border border-orange/20 uppercase text-[9px] font-sans px-1.5 py-0.5 rounded font-medium">Default</span>}
                      </div>
                      <p className="text-xs text-navy/75 font-normal mt-2 leading-relaxed">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                      <p className="text-[10px] font-medium text-navy/50 mt-1.5 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-orange" /> Contact: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add form */}
              {!showAddressForm ? (
                <button 
                  onClick={() => setShowAddressForm(true)}
                  className="border border-dashed border-border-color bg-card-bg hover:border-orange rounded-2xl p-4 w-full text-center text-xs font-medium text-navy flex items-center justify-center gap-1.5 transition-all"
                >
                  + Add New Saved Address
                </button>
              ) : (
                <form onSubmit={handleAddNewAddress} className="bg-card-bg border border-border-color p-6 rounded-3xl space-y-4 shadow-md text-navy">
                  <div className="flex justify-between items-center pb-2 border-b border-border-color">
                    <h3 className="font-serif font-medium text-navy text-sm">Add New Saved Address</h3>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="text-xs text-red-500 font-medium hover:underline">Cancel</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Recipient Name" required 
                      value={addrName} onChange={(e) => setAddrName(e.target.value)}
                      className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
                    />
                    <input 
                      type="tel" placeholder="Mobile Phone contact" required 
                      value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)}
                      className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
                    />
                  </div>

                  <input 
                    type="text" placeholder="Street Address, Appartment, Landmark" required 
                    value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)}
                    className="w-full text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <input 
                      type="text" placeholder="City" required 
                      value={addrCity} onChange={(e) => setAddrCity(e.target.value)}
                      className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
                    />
                    <input 
                      type="text" placeholder="State" required 
                      value={addrState} onChange={(e) => setAddrState(e.target.value)}
                      className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
                    />
                    <input 
                      type="text" placeholder="PIN Code" required 
                      value={addrZip} onChange={(e) => setAddrZip(e.target.value)}
                      className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="bg-orange hover:bg-orange-hover text-white font-medium py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    Save Address Details
                  </button>
                </form>
              )}

            </div>
          )}

          {/* TAB 3: ORDERS AND INVOICE SHIPMENT TIMELINE TRACKING */}
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              
              {/* Left Col: Previous Orders List */}
              <div className="lg:col-span-5 space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
                {orders.length === 0 ? (
                  <div className="bg-card-bg border border-border-color rounded-2xl p-8 text-center space-y-2 text-navy">
                    <p className="text-xs text-navy/40 italic font-normal">No checkout histories found.</p>
                    <Link href="/category/all" className="text-xs font-medium text-orange hover:underline block">Explore Confectioneries</Link>
                  </div>
                ) : (
                  orders.map(order => (
                    <div 
                      key={order._id}
                      onClick={() => setTrackingOrder(order)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all bg-card-bg text-navy space-y-2 ${trackingOrder?._id === order._id ? 'border-orange shadow-sm' : 'border-border-color hover:border-orange'}`}
                    >
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="font-serif text-orange font-medium">{order.invoiceNumber}</span>
                        <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-medium ${order.status === 'Delivered' ? 'bg-success/10 border border-success/20 text-success' : order.status === 'Cancelled' ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-orange/15 text-orange border border-orange/20'}`}>{order.status}</span>
                      </div>
                      <div className="text-[10px] text-navy/50 font-normal">
                        <p>Total Dues: ₹{order.pricing.totalAmount} ({order.items.length} items)</p>
                        <p>Scheduled: {order.deliveryDetails.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Col: Active Order tracking Timeline detail */}
              {trackingOrder && (
                <div className="lg:col-span-7 bg-card-bg border border-border-color rounded-[28px] p-6 space-y-6 shadow-md text-navy">
                  <div className="flex justify-between items-start border-b border-border-color pb-3">
                    <div>
                      <h3 className="font-serif font-medium text-navy text-base">Shipment Tracking Desk</h3>
                      <p className="text-[10px] text-navy/50 font-medium uppercase mt-0.5">Details for: {trackingOrder.invoiceNumber}</p>
                    </div>
                    {['Confirmed', 'Baking', 'Packed'].includes(trackingOrder.status) && (
                      <button 
                        onClick={() => setShowCancelModal(true)}
                        className="text-[10px] font-medium text-red-500 uppercase hover:underline"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Active timeline tracker */}
                  <div className="space-y-6">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-navy/50">Delivery Timeline Status</p>
                    
                    <div className="relative pl-8 space-y-6 text-xs font-medium text-navy">
                      {/* Spine bar */}
                      <div className="absolute top-1.5 left-3.5 w-0.5 bottom-1.5 bg-border-color shrink-0"></div>

                      {/* Milestone 1: Confirmed */}
                      <TimelineNode 
                        title="Order Confirmed & Placed" 
                        desc={trackingOrder.timeline.find(t => t.status === 'Confirmed')?.note || 'Payment cleared. Custom details approved.'}
                        timestamp={trackingOrder.timeline.find(t => t.status === 'Confirmed')?.timestamp}
                        active={true}
                        checked={true}
                      />

                      {/* Milestone 2: Baking */}
                      <TimelineNode 
                        title="Baking in Progress" 
                        desc={trackingOrder.timeline.find(t => t.status === 'Baking')?.note || 'Chef preparing customized dough and piping.'}
                        timestamp={trackingOrder.timeline.find(t => t.status === 'Baking')?.timestamp}
                        active={['Baking', 'Packed', 'Out for delivery', 'Delivered'].includes(trackingOrder.status)}
                        checked={['Baking', 'Packed', 'Out for delivery', 'Delivered'].includes(trackingOrder.status)}
                      />

                      {/* Milestone 3: Packed */}
                      <TimelineNode 
                        title="Quality Sealed & Packed" 
                        desc={trackingOrder.timeline.find(t => t.status === 'Packed')?.note || 'Certified confectionery quality sealed.'}
                        timestamp={trackingOrder.timeline.find(t => t.status === 'Packed')?.timestamp}
                        active={['Packed', 'Out for delivery', 'Delivered'].includes(trackingOrder.status)}
                        checked={['Packed', 'Out for delivery', 'Delivered'].includes(trackingOrder.status)}
                      />

                      {/* Milestone 4: Out for delivery */}
                      <TimelineNode 
                        title="Out for Delivery" 
                        desc={trackingOrder.timeline.find(t => t.status === 'Out for delivery')?.note || 'Dispatched in insulated local vehicle.'}
                        timestamp={trackingOrder.timeline.find(t => t.status === 'Out for delivery')?.timestamp}
                        active={['Out for delivery', 'Delivered'].includes(trackingOrder.status)}
                        checked={['Out for delivery', 'Delivered'].includes(trackingOrder.status)}
                      />

                      {/* Milestone 5: Delivered */}
                      {trackingOrder.status === 'Cancelled' ? (
                        <TimelineNode 
                          title="Booking Cancelled" 
                          desc={trackingOrder.timeline.find(t => t.status === 'Cancelled')?.note || 'Cancelled by shopper.'}
                          timestamp={trackingOrder.timeline.find(t => t.status === 'Cancelled')?.timestamp}
                          active={true}
                          checked={true}
                          cancelled={true}
                        />
                      ) : (
                        <TimelineNode 
                          title="Delivered Successfully" 
                          desc={trackingOrder.timeline.find(t => t.status === 'Delivered')?.note || 'Hand-delivered. Feedback recorded.'}
                          timestamp={trackingOrder.timeline.find(t => t.status === 'Delivered')?.timestamp}
                          active={trackingOrder.status === 'Delivered'}
                          checked={trackingOrder.status === 'Delivered'}
                        />
                      )}

                    </div>

                    {/* Invoice detail link path */}
                    <div className="pt-4 border-t border-border-color flex justify-between items-center text-xs font-medium">
                      <div className="text-navy/65">
                        <p>Payment: {trackingOrder.payment.method} ({trackingOrder.payment.status})</p>
                        <p className="mt-0.5 text-navy/50 font-normal">Transact ID: {trackingOrder.payment.transactionId}</p>
                      </div>
                      
                      {/* Simulating printing check paths */}
                      <Link 
                        href={`/checkout?invoice=${trackingOrder.invoiceNumber}`} 
                        className="bg-cream hover:bg-cream/80 border border-border-color text-navy py-2.5 px-5 rounded-2xl transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4 text-navy/60" /> Download Invoice
                      </Link>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-card-bg border border-border-color rounded-[28px] p-6 space-y-4 shadow-md text-navy animate-fade-in">
              <h2 className="font-serif font-medium text-lg border-b border-border-color pb-2.5">Your Wishlisted Confectioneries</h2>
              
              {wishlistProducts.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-xs text-navy/40 italic font-normal">Your wishlist is currently clear.</p>
                  <Link href="/category/all" className="text-xs font-medium text-orange hover:underline block uppercase">Explore Catalog</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistProducts.map((prod) => (
                    <div key={prod._id} className="border border-border-color rounded-2xl p-3 flex gap-3 items-center justify-between hover:border-orange transition-colors bg-cream">
                      <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-lg border border-border-color" />
                      <div className="truncate flex-1 font-medium text-xs">
                        <Link href={`/product/${prod.slug}`} className="hover:text-orange block truncate text-navy">{prod.name}</Link>
                        <span className="text-orange mt-0.5 block">₹{prod.discountPrice || prod.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* CANCELLATION REQUEST POPUP MODAL */}
      {showCancelModal && trackingOrder && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCancelOrderSubmit} className="bg-card-bg border border-border-color rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl relative text-navy">
            <button type="button" onClick={() => setShowCancelModal(false)} className="absolute top-4 right-4 p-1 hover:bg-cream rounded-full text-navy"><X className="w-5 h-5" /></button>
            <div className="flex gap-2.5 items-center text-red-500 font-serif font-medium text-lg">
              <AlertTriangle className="w-6 h-6 animate-pulse" /> Confirm Cancellation
            </div>
            <p className="text-xs text-navy/75 font-normal leading-relaxed">
              Are you sure you want to cancel order <b className="text-navy">{trackingOrder.invoiceNumber}</b>? Custom confectioneries in baking cannot be returned. If advance was paid, a refund voucher will be dispatched.
            </p>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-medium text-navy/55 tracking-wider">Reason for Cancellation</label>
              <textarea 
                required rows={3} placeholder="Please tell our chef why you need to cancel..."
                value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs font-normal p-3 border border-border-color bg-background text-navy rounded-xl outline-none focus:ring-1 focus:ring-orange"
              />
            </div>
            <div className="flex gap-3 pt-2 font-medium text-xs">
              <button type="button" onClick={() => setShowCancelModal(false)} className="flex-1 border border-border-color hover:bg-cream text-navy py-2.5 rounded-xl transition-colors">Discard</button>
              <button type="submit" className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition-colors">Confirm Cancel</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

// TIMELINE ELEMENT UTILITY
function TimelineNode({ title, desc, timestamp, active, checked, cancelled }) {
  return (
    <div className="relative pl-1">
      {/* Circle Bullet icon */}
      <div className={`absolute -left-8 top-0.5 w-6.5 h-6.5 rounded-full border-2 flex items-center justify-center text-[10px] z-10 shrink-0 ${cancelled ? 'bg-red-500 border-red-500 text-white shadow-md' : checked ? 'bg-orange border-orange text-white shadow-md' : active ? 'bg-card-bg border-orange text-orange animate-pulse' : 'bg-card-bg border-border-color text-navy/30'}`}>
        {cancelled ? 'X' : checked ? <Check className="w-3.5 h-3.5" /> : '•'}
      </div>

      <div className={`${active ? 'text-navy' : 'text-navy/40'}`}>
        <div className="flex justify-between items-baseline flex-wrap gap-2 text-xs">
          <h4 className="font-serif font-medium text-sm">{title}</h4>
          {timestamp && <span className="text-[9px] font-medium text-navy/45">{new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
        </div>
        <p className={`text-xs mt-1 leading-normal ${active ? 'text-navy/65' : 'text-navy/30'} font-normal`}>{desc}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center py-24 bg-background text-navy gap-3">
        <div className="w-12 h-12 border-t-2 border-b-2 border-orange rounded-full animate-spin"></div>
        <span className="font-sans font-medium animate-pulse uppercase tracking-wider text-xs">Cooking Profile...</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
