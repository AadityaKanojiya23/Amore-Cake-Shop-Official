'use client';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trash, ShoppingBag, Plus, Minus, CreditCard, 
  Tag, AlertCircle, ArrowRight, ShieldCheck, Heart
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { 
    cart, updateCartQuantity, removeFromCart, coupons, showToast, isBackendOnline 
  } = useApp();

  const router = useRouter();
  
  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Calculate prices
  const subtotal = cart.reduce((sum, item) => {
    // Add custom charges: Eggless (+50)
    let itemPrice = item.price;
    if (item.isEggless) itemPrice += 50;
    
    // Custom accessory pricing
    if (item.addCandles) itemPrice += 50;
    if (item.addFlowers) itemPrice += 299;
    if (item.addChocolates) itemPrice += 150;

    return sum + (itemPrice * item.quantity);
  }, 0);

  // Apply discount logic
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discountAmount) / 100;
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountAmount;
    }
  }

  const gstAmount = Math.round(subtotal * 0.05); // Food GST
  const shippingCharge = subtotal > 499 || subtotal === 0 ? 0 : 50; // free shipping above 499
  const totalAmount = subtotal + gstAmount + shippingCharge - discountAmount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');

    if (!couponInput.trim()) return;

    const code = couponInput.toUpperCase().trim();
    
    // Find matching coupon locally (or fetch from API, our context handles local offline fallback too!)
    const matched = coupons.find(c => c.code.toUpperCase() === code && c.isActive);

    if (matched) {
      if (subtotal < matched.minPurchase) {
        setCouponError(`Minimum purchase of ₹${matched.minPurchase} required for this code.`);
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(matched);
      showToast(`Coupon code ${code} applied successfully!`, 'success');
    } else {
      // Fallback for standard demo codes
      if (code === 'WELCOME15') {
        const welcomeCoupon = { code: 'WELCOME15', discountType: 'percentage', discountAmount: 15, minPurchase: 400, maxDiscount: 150 };
        if (subtotal < 400) {
          setCouponError('Minimum purchase of ₹400 required for code WELCOME15.');
          return;
        }
        setAppliedCoupon(welcomeCoupon);
        showToast('Promo WELCOME15 applied: 15% discount!', 'success');
      } else {
        setCouponError('Invalid, expired, or inactive coupon code.');
        setAppliedCoupon(null);
      }
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    showToast('Promo code removed', 'info');
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    
    // Save coupon selection temporarily in session storage to calculate checkout discount
    if (appliedCoupon) {
      sessionStorage.setItem('sweetcrave_checkout_coupon', JSON.stringify(appliedCoupon));
    } else {
      sessionStorage.removeItem('sweetcrave_checkout_coupon');
    }
    
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="flex-grow max-w-2xl mx-auto px-4 py-24 text-center space-y-6 bg-background text-foreground">
        <div className="text-6xl animate-bounce">🛒</div>
        <h1 className="font-serif font-black text-3xl text-navy">Your Shopping Basket is Empty</h1>
        <p className="text-navy/60 text-sm max-w-sm mx-auto font-semibold leading-relaxed">
          Looks like you haven&apos;t added any of our delicious customized baking creations to your shopping basket yet!
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link href="/category/all" className="bg-orange hover:bg-orange-hover text-white font-black py-3.5 px-8 rounded-full text-xs transition-all shadow-md hover:scale-102">
            Explore Cake Catalog
          </Link>
          <Link href="/dashboard?tab=wishlist" className="bg-cream hover:bg-cream/80 text-navy border border-border-color font-black py-3.5 px-8 rounded-full text-xs transition-colors">
            View Your Wishlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background text-foreground">
      
      <h1 className="text-2xl md:text-3.5xl font-serif font-black text-navy flex items-center gap-2">
        Shopping Cart <span className="text-xs bg-orange/15 text-orange border border-orange/20 font-black px-3 py-1 rounded-full">{cart.length} Confectioneries</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Cart Item Cards List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            // Calculate base price + addon custom modifications
            let basePrice = item.price;
            if (item.isEggless) basePrice += 50;

            const addonsList = [];
            if (item.isEggless) addonsList.push('Pure Eggless (+₹50)');
            if (item.addCandles) addonsList.push('Metallic Candles (+₹50)');
            if (item.addFlowers) addonsList.push('Rose Flowers (+₹299)');
            if (item.addChocolates) addonsList.push('Cadbury Box (+₹150)');

            return (
              <div 
                key={item.cartItemId} 
                className="bg-card-bg border border-border-color p-4 rounded-3xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm relative group hover:border-orange transition-colors"
              >
                
                {/* Delete cross */}
                <button 
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-navy/40 hover:text-red-500 rounded-full transition-colors"
                  title="Remove item"
                >
                  <Trash className="w-4 h-4" />
                </button>

                <div className="flex gap-4 items-center flex-1 max-w-md">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-2xl border border-border-color shadow-sm"
                  />
                  <div className="space-y-1">
                    <h3 className="font-serif font-black text-navy text-base truncate pr-6 leading-tight">{item.name}</h3>
                    
                    {/* Weight and flavor customizations labels */}
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-black uppercase text-navy/55 mt-1">
                      <span className="bg-cream px-2 py-0.5 rounded border border-border-color">Weight: {item.weight}</span>
                      <span className="bg-cream px-2 py-0.5 rounded border border-border-color">Flavor: {item.flavor}</span>
                    </div>

                    {/* Add-ons list details */}
                    {addonsList.length > 0 && (
                      <p className="text-[10px] font-black text-success block">Modifications: {addonsList.join(', ')}</p>
                    )}

                    {/* Custom inscription message details */}
                    {item.cakeMessage && (
                      <p className="text-[10px] font-black italic text-navy/65 block truncate">Inscription: &quot;{item.cakeMessage}&quot;</p>
                    )}
                  </div>
                </div>

                {/* Counter and Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 border-t sm:border-none pt-3 sm:pt-0 border-border-color">
                  
                  {/* Item price sum */}
                  <div className="text-right">
                    <span className="text-orange font-black text-base block">₹{(basePrice + (item.addCandles ? 50 : 0) + (item.addFlowers ? 299 : 0) + (item.addChocolates ? 150 : 0)) * item.quantity}</span>
                    <span className="text-navy/40 text-[10px] font-bold block">₹{basePrice + (item.addCandles ? 50 : 0) + (item.addFlowers ? 299 : 0) + (item.addChocolates ? 150 : 0)} each</span>
                  </div>

                  {/* Quantity selector buttons */}
                  <div className="flex items-center gap-2 border border-border-color bg-cream rounded-xl py-1.5 px-3">
                    <button 
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1 hover:bg-background rounded text-navy transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-navy w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1 hover:bg-background rounded text-navy transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Right Col: Price Checkouts & Coupons Summary panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Entry form block */}
          <div className="bg-card-bg border border-border-color rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-black text-navy text-base flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-orange" /> Have a Coupon Code?
            </h3>
            
            {appliedCoupon ? (
              <div className="bg-success/5 border border-success/20 rounded-xl p-3.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-black text-success">Promo: <span className="font-black uppercase text-orange">{appliedCoupon.code}</span></p>
                  <p className="text-navy/70 font-semibold mt-0.5">Applied {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountAmount}% Discount` : `₹${appliedCoupon.discountAmount} Discount`}</p>
                </div>
                <button 
                  onClick={handleRemoveCoupon}
                  className="text-[10px] font-black text-red-500 uppercase hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="E.g. WELCOME15" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full text-xs font-black border border-border-color p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-orange bg-background text-navy uppercase"
                />
                <button 
                  type="submit" 
                  className="bg-navy hover:bg-navy-dark text-white font-black py-2.5 px-5 rounded-xl text-xs transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[10px] text-red-500 font-black flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {couponError}</p>
            )}

            <div className="text-[10px] font-black text-navy/50 bg-cream p-2 rounded.5 border border-border-color">
              👉 Try using code <b className="text-orange">WELCOME15</b> for 15% discount! (Min Purchase ₹400)
            </div>
          </div>

          {/* Pricing dues layout */}
          <div className="bg-card-bg border border-border-color rounded-[28px] p-6 space-y-4 shadow-md">
            <h3 className="font-serif font-black text-navy text-base border-b border-border-color pb-2.5">Order Value Details</h3>
            
            <div className="space-y-2.5 text-xs font-semibold text-navy/75">
              <div className="flex justify-between">
                <span>Confectionery Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-success">
                  <span>Coupon Discount Applied</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Food CGST & SGST (5% tax)</span>
                <span>₹{gstAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Standard Delivery Shipment</span>
                <span>{shippingCharge === 0 ? <b className="text-success">FREE</b> : `₹${shippingCharge}`}</span>
              </div>
            </div>

            {/* Total line item */}
            <div className="border-t border-border-color pt-4 flex justify-between items-baseline">
              <span className="font-serif font-black text-navy text-lg">Total Payable Dues</span>
              <span className="text-orange font-black text-2.5xl">₹{totalAmount}</span>
            </div>

            {/* Checkout buttons path */}
            <div className="pt-2">
              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-orange hover:bg-orange-hover text-white font-black py-3.5 rounded-2xl text-xs transition-all flex justify-center items-center gap-2 shadow-lg hover:scale-102 uppercase"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[10px] text-navy/50 text-center flex justify-center items-center gap-1.5 pt-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-success" /> 256-Bit SSL Encrypted Transmissions
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
