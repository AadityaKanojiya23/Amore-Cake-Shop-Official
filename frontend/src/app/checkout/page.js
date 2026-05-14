'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, ShieldCheck, Check, Info, MapPin, 
  ArrowLeft, ArrowRight, Truck, QrCode, Phone, Download, Printer, Home, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const { 
    cart, user, token, placeOrder, addAddress, showToast, loginWithGoogle, isBackendOnline, orders 
  } = useApp();

  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceParam = searchParams.get('invoice');

  // Step state: 1 = Address, 2 = Payment, 3 = Success
  const [step, setStep] = useState(1);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Address Selection
  const [selectedAddrId, setSelectedAddrId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectNewAddress, setSelectNewAddress] = useState(false);

  // Address Form fields
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');

  // Delivery type (Standard/Midnight/Express) - synced from sessionStorage or first cart item dates
  const [deliveryType, setDeliveryType] = useState('Standard');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // CARD, UPI, COD
  const [checkoutCoupon, setCheckoutCoupon] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Load customizations, addresses, and query invoice parameter
  useEffect(() => {
    if (invoiceParam && orders && orders.length > 0) {
      const matched = orders.find(o => o.invoiceNumber === invoiceParam);
      if (matched) {
        setPlacedOrder(matched);
        setStep(3);
        setIsInitialized(true);
        return;
      }
    }

    if (cart.length === 0 && step !== 3 && !invoiceParam) {
      router.push('/cart');
      return;
    }

    if (!isInitialized) {
      // Set delivery details from cart
      if (cart.length > 0) {
        // Use the delivery date from the first item if it was selected in Product Page
        const firstItem = cart[0];
        setDeliveryDate(firstItem.deliveryDate || new Date().toISOString().split('T')[0]);
        setDeliverySlot(firstItem.deliverySlot || 'Standard (12 PM - 6 PM)');
        setDeliveryType(firstItem.deliveryType || 'Standard');
      }

      // Load temp coupon
      const tempCoupon = sessionStorage.getItem('sweetcrave_checkout_coupon');
      if (tempCoupon) {
        setCheckoutCoupon(JSON.parse(tempCoupon));
      }

      setIsInitialized(true);
    }

    // Set initial address ID or sync new address selection
    if (user && user.addresses && user.addresses.length > 0) {
      if (selectNewAddress) {
        const lastAddr = user.addresses[user.addresses.length - 1];
        if (lastAddr) {
          setSelectedAddrId(lastAddr._id);
        }
        setSelectNewAddress(false);
      } else {
        const addressStillExists = user.addresses.some(a => a._id === selectedAddrId);
        if (!selectedAddrId || !addressStillExists) {
          const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
          setSelectedAddrId(def._id);
        }
      }
    } else {
      setShowAddressForm(true);
    }
  }, [user, cart, isInitialized, selectedAddrId, selectNewAddress]);

  // Handle Address Addition
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
      setSelectNewAddress(true);
      setStep(2); // Automatically navigate directly to step 2 payment options
      // Reset form
      setAddrName('');
      setAddrPhone('');
      setAddrStreet('');
      setAddrCity('');
      setAddrState('');
      setAddrZip('');
    }
  };

  // Pricing tallies
  const subtotal = cart.reduce((sum, item) => {
    let price = item.price;
    if (item.isEggless) price += 50;
    if (item.addCandles) price += 50;
    if (item.addFlowers) price += 299;
    if (item.addChocolates) price += 150;
    return sum + (price * item.quantity);
  }, 0);

  let discountApplied = 0;
  if (checkoutCoupon) {
    if (checkoutCoupon.discountType === 'percentage') {
      discountApplied = (subtotal * checkoutCoupon.discountAmount) / 100;
      if (checkoutCoupon.maxDiscount && discountApplied > checkoutCoupon.maxDiscount) {
        discountApplied = checkoutCoupon.maxDiscount;
      }
    } else {
      discountApplied = checkoutCoupon.discountAmount;
    }
  }

  const gstAmount = Math.round(subtotal * 0.05);
  let shippingCharge = 50;
  if (deliveryType === 'Midnight') shippingCharge = 150;
  else if (deliveryType === 'Express') shippingCharge = 100;

  if (subtotal > 499) shippingCharge = 0; // free shipping discount

  const totalAmount = subtotal + gstAmount + shippingCharge - discountApplied;

  // COD splits
  const codAdvance = Math.round(totalAmount * 0.3); // 30% advance online
  const codDeliveryDue = totalAmount - codAdvance; // remaining on delivery

  // Process Final checkout transactions
  const handleConfirmOrder = async () => {
    if (!user) {
      showToast('Please register or login first to process your order.', 'warning');
      return;
    }

    const matchedAddress = user.addresses.find(a => a._id === selectedAddrId);
    if (!matchedAddress) {
      showToast('Please select a shipping address.', 'warning');
      return;
    }

    setSubmittingOrder(true);
    const orderDetails = {
      name: matchedAddress.name,
      phone: matchedAddress.phone,
      street: matchedAddress.street,
      city: matchedAddress.city,
      state: matchedAddress.state,
      zipCode: matchedAddress.zipCode
    };

    const deliveryDetails = {
      date: deliveryDate,
      timeSlot: deliverySlot,
      type: deliveryType
    };

    const res = await placeOrder(
      orderDetails,
      deliveryDetails,
      paymentMethod,
      discountApplied
    );

    setSubmittingOrder(false);
    if (res.success && res.order) {
      setPlacedOrder(res.order);
      setStep(3);
      sessionStorage.removeItem('sweetcrave_checkout_coupon');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // If not logged in, show auth prompt
  if (!user) {
    return (
      <div className="flex-grow max-w-xl mx-auto px-4 py-24 text-center space-y-6 bg-background text-foreground">
        <div className="text-5xl animate-pulse">🔒</div>
        <h1 className="font-serif font-medium text-2.5xl text-navy">Secure Checkout Authorization</h1>
        <p className="text-navy/70 text-sm font-normal leading-relaxed">To complete secure ordering and track your shipments dynamically, you must authorize your shopper profile.</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:py-0 bg-background text-foreground">
      
      {/* Title block hides in print layout */}
      <div className="flex items-center gap-4 justify-between border-b border-border-color pb-4 print:hidden">
        <h1 className="text-xl md:text-2.5xl font-serif font-medium text-navy flex items-center gap-2">
          Secure Shipping Desk 
          <span className="text-xs bg-success/10 text-success font-medium border border-success/20 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-success" /> SSL SECURED
          </span>
        </h1>
        {step < 3 && (
          <button onClick={() => router.push('/cart')} className="text-xs font-medium text-navy flex items-center gap-1 hover:text-orange transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>
        )}
      </div>

      {/* STEP 1 & 2: Main Checkout Form Details */}
      {step < 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: Shipping details & Payment Selector */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step Indicators */}
            <div className="flex gap-4 border-b border-border-color pb-4 text-xs font-medium uppercase tracking-wider">
              <button onClick={() => setStep(1)} className={`pb-2 border-b-2 transition-all ${step === 1 ? 'border-orange text-orange' : 'border-transparent text-navy/40'}`}>1. Delivery Address</button>
              <button onClick={() => setStep(2)} className={`pb-2 border-b-2 transition-all ${step === 2 ? 'border-orange text-orange' : 'border-transparent text-navy/40'}`}>2. Secure Payment</button>
            </div>

            {/* STEP 1: ADDRESS SELECTION LAYOUT */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif font-medium text-navy text-lg">Select Delivery Address</h2>
                
                {/* List of user's saved addresses */}
                {user.addresses && user.addresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div 
                        key={addr._id}
                        onClick={() => setSelectedAddrId(addr._id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddrId === addr._id ? 'border-orange bg-cream shadow-md' : 'border-border-color hover:border-orange bg-card-bg'}`}
                      >
                        <div className="flex justify-between items-start text-xs text-navy font-medium">
                          <span className="font-serif font-medium text-sm">{addr.name}</span>
                          {addr.isDefault && <span className="bg-orange/15 text-orange border border-orange/20 uppercase text-[9px] px-2 py-0.5 rounded font-medium">Default</span>}
                        </div>
                        <p className="text-xs text-navy/70 font-normal mt-2 leading-relaxed">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                        <p className="text-[10px] font-medium text-navy/50 mt-1.5 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-orange" /> Contact: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Switch to show form */}
                {!showAddressForm ? (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="border border-dashed border-border-color hover:border-orange bg-card-bg rounded-2xl p-4 w-full text-center text-xs font-medium text-navy flex items-center justify-center gap-1.5 transition-all"
                  >
                    + Ship to a New Address
                  </button>
                ) : (
                  <form onSubmit={handleAddNewAddress} className="bg-cream border border-border-color p-6 rounded-3xl space-y-4 shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-border-color">
                      <h3 className="font-serif font-medium text-navy text-sm">Add New Delivery Location</h3>
                      {user.addresses && user.addresses.length > 0 && (
                        <button type="button" onClick={() => setShowAddressForm(false)} className="text-xs text-red-500 font-medium hover:underline">Cancel</button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Recipient Full Name" required 
                        value={addrName} onChange={(e) => setAddrName(e.target.value)}
                        className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy focus:ring-1 focus:ring-orange"
                      />
                      <input 
                        type="tel" placeholder="Mobile Phone Contact" required 
                        value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)}
                        className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy focus:ring-1 focus:ring-orange"
                      />
                    </div>

                    <input 
                      type="text" placeholder="Street Address, Flat/Suite No, Landmark" required 
                      value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)}
                      className="w-full text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy focus:ring-1 focus:ring-orange"
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <input 
                        type="text" placeholder="City" required 
                        value={addrCity} onChange={(e) => setAddrCity(e.target.value)}
                        className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy focus:ring-1 focus:ring-orange"
                      />
                      <input 
                        type="text" placeholder="State" required 
                        value={addrState} onChange={(e) => setAddrState(e.target.value)}
                        className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy focus:ring-1 focus:ring-orange"
                      />
                      <input 
                        type="text" placeholder="Postal Code / PIN" required 
                        value={addrZip} onChange={(e) => setAddrZip(e.target.value)}
                        className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy focus:ring-1 focus:ring-orange"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="bg-orange hover:bg-orange-hover text-white font-medium py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm"
                    >
                      Save and Ship to This Address
                    </button>
                  </form>
                )}

                {/* Delivery Schedule Section */}
                <div className="bg-cream border border-border-color rounded-3xl p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-medium text-navy uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange" /> Scheduled Delivery Slot Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-medium text-navy/60">Preferred Date</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full text-xs font-medium p-2.5 bg-card-bg border border-border-color rounded-xl outline-none focus:ring-1 focus:ring-orange text-navy cursor-pointer"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-medium text-navy/60">Delivery Hour Bracket</label>
                      <select 
                        value={deliverySlot}
                        onChange={(e) => {
                          setDeliverySlot(e.target.value);
                          const isMidnight = e.target.value.includes('Midnight');
                          const isExpress = e.target.value.includes('Express');
                          setDeliveryType(isMidnight ? 'Midnight' : isExpress ? 'Express' : 'Standard');
                        }}
                        className="w-full text-xs font-medium p-2.5 bg-card-bg border border-border-color rounded-xl outline-none focus:ring-1 focus:ring-orange text-navy cursor-pointer"
                      >
                        <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM) [+ ₹50]</option>
                        <option value="Standard (12 PM - 6 PM)">Standard (12 PM - 6 PM) [Free]</option>
                        <option value="Express (6 PM - 9 PM)">Express (6 PM - 9 PM) [+ ₹100]</option>
                        <option value="Midnight (11 PM - 12 AM)">Midnight (11 PM - 12 AM) [+ ₹150 Premium]</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                {selectedAddrId && (
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={() => setStep(2)}
                      className="bg-orange hover:bg-orange-hover text-white font-medium py-3.5 px-8 rounded-2xl text-xs transition-all flex items-center gap-1.5 shadow-md hover:scale-102"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD SELECTOR */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif font-medium text-navy text-lg">Select Secure Payment Gateways</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card selector */}
                  <div 
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer text-center space-y-2.5 transition-all ${paymentMethod === 'CARD' ? 'border-orange bg-cream' : 'border-border-color hover:border-orange bg-card-bg'}`}
                  >
                    <div className="flex justify-center text-navy"><CreditCard className="w-8 h-8 text-orange" /></div>
                    <span className="text-xs font-medium text-navy block uppercase">Online Card Gateway</span>
                    <p className="text-[10px] text-navy/50 font-medium leading-relaxed">Razorpay Secure Visa/Mastercard Instant 100% confirmation.</p>
                  </div>

                  {/* UPI QR selector */}
                  <div 
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer text-center space-y-2.5 transition-all ${paymentMethod === 'UPI' ? 'border-orange bg-cream' : 'border-border-color hover:border-orange bg-card-bg'}`}
                  >
                    <div className="flex justify-center text-navy"><QrCode className="w-8 h-8 text-orange" /></div>
                    <span className="text-xs font-medium text-navy block uppercase">UPI GPay QR Code</span>
                    <p className="text-[10px] text-navy/50 font-medium leading-relaxed">Display instant checkout QR code. Scan and transfer.</p>
                  </div>

                  {/* COD selector */}
                  <div 
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer text-center space-y-2.5 transition-all ${paymentMethod === 'COD' ? 'border-orange bg-cream' : 'border-border-color hover:border-orange bg-card-bg'}`}
                  >
                    <div className="flex justify-center text-navy"><Truck className="w-8 h-8 text-orange" /></div>
                    <span className="text-xs font-medium text-navy block uppercase">Cash On Delivery</span>
                    <p className="text-[10px] text-navy/50 font-medium leading-relaxed">Pay <b className="text-orange">30% split advance</b> online, and rest on delivery.</p>
                  </div>
                </div>

                {/* Sub-form specifics based on methods */}
                {paymentMethod === 'CARD' && (
                  <div className="bg-cream border border-border-color rounded-2xl p-5 space-y-3 shadow-inner">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-navy">Simulated Razorpay Card Entry</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input type="text" maxLength={16} placeholder="Card Number (Demo)" className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy" />
                      <input type="text" maxLength={5} placeholder="MM/YY" className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy" />
                      <input type="password" maxLength={3} placeholder="CVV" className="text-xs font-normal p-2.5 bg-background border border-border-color rounded-xl outline-none text-navy" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="bg-cream border border-border-color rounded-2xl p-5 space-y-3 text-center shadow-inner flex flex-col items-center gap-2">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-navy">Interactive UPI QR Code Checkout</h3>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay_to_amorecakes" alt="QR" className="w-28 h-28 border border-border-color p-1 rounded-lg shadow-sm" />
                    <p className="text-[10px] text-navy/50 max-w-xs leading-relaxed font-medium">Scan this secure QR code using any UPI app (GPay, PhonePe, Paytm). Payment verifies instantly.</p>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="bg-cream border border-border-color rounded-2xl p-5 space-y-2.5 shadow-inner">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-navy flex items-center gap-1">
                      <Info className="w-4 h-4 text-orange" /> Cash On Delivery Splitting Rules
                    </h3>
                    <p className="text-xs text-navy/85 leading-relaxed font-normal">
                      Because custom confectionery represents dedicated material baking, we collect a <b className="text-navy">30% secure advance online (₹{codAdvance})</b>. The remaining <b className="text-orange">70% balance (₹{codDeliveryDue})</b> will be payable in cash or UPI at delivery site.
                    </p>
                  </div>
                )}

                {/* Actions row */}
                <div className="pt-4 flex justify-between border-t border-border-color">
                  <button onClick={() => setStep(1)} className="text-xs font-medium text-navy hover:underline flex items-center gap-1 transition-all">
                    <ArrowLeft className="w-4 h-4 text-orange" /> Address selection
                  </button>
                  <button 
                    onClick={handleConfirmOrder}
                    disabled={submittingOrder}
                    className="bg-orange hover:bg-orange-hover text-white font-medium py-3.5 px-8 rounded-2xl text-xs transition-all flex items-center gap-1.5 shadow-lg hover:scale-102 uppercase"
                  >
                    <span>{submittingOrder ? 'Verifying Checkout Dues...' : 'Confirm Order & Place Booking'}</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Column Right: Order details side panel */}
          <div className="lg:col-span-4 bg-card-bg border border-border-color rounded-[28px] p-6 space-y-6 shadow-md print:hidden">
            <h3 className="font-serif font-medium text-navy text-base border-b border-border-color pb-2.5">Checkout Summary</h3>
            
            <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar border-b border-border-color pb-4 pr-1">
              {cart.map(item => (
                <div key={item.cartItemId} className="flex gap-3 items-center justify-between text-xs font-medium text-navy">
                  <div className="truncate flex-1">
                    <p className="truncate text-navy">{item.name}</p>
                    <span className="text-[9px] text-navy/50 font-normal block">{item.weight} | Qty: {item.quantity}</span>
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs font-normal text-navy/70">
              <div className="flex justify-between">
                <span>Subtotal Value</span>
                <span>₹{subtotal}</span>
              </div>
              {checkoutCoupon && (
                <div className="flex justify-between text-success">
                  <span>Promo applied ({checkoutCoupon.code})</span>
                  <span>- ₹{discountApplied}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>CGST & SGST (5%)</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Shipping Rate ({deliveryType})</span>
                <span>{shippingCharge === 0 ? <b className="text-success">FREE</b> : `₹${shippingCharge}`}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-border-color pt-4 flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="font-serif font-medium text-navy text-base">Grand Total</span>
                <span className="text-orange font-medium text-2.5xl">₹{totalAmount}</span>
              </div>
              {paymentMethod === 'COD' && (
                <div className="bg-cream p-2.5 rounded-xl border border-border-color text-[10px] space-y-1 mt-1 text-navy font-normal">
                  <div className="flex justify-between font-medium">
                    <span>30% split advance (Pay online):</span>
                    <span>₹{codAdvance}</span>
                  </div>
                  <div className="flex justify-between text-navy/50">
                    <span>70% due at delivery:</span>
                    <span>₹{codDeliveryDue}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: TRANSACTION SUCCESS PAGE WITH DOWNLOADABLE INVOICE GENERATOR */}
      {step === 3 && placedOrder && (
        <div className="max-w-3xl mx-auto space-y-8 animate-float-short">
          
          {/* Congrats Header */}
          <div className="text-center space-y-3 print:hidden">
            <div className="w-16 h-16 bg-success/10 text-success border border-success/20 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">🎉</div>
            <h2 className="font-serif font-medium text-3xl text-navy leading-tight">Order Placed Successfully!</h2>
            <p className="text-navy/70 text-xs md:text-sm font-normal">Congratulations! Your premium confectionery booking is verified. We sent confirmation receipt via email.</p>
          </div>

          {/* DETAILED PRINTABLE COMPACT INVOICE CARD */}
          <div className="bg-card-bg border-4 border-double border-border-color p-6 md:p-8 rounded-[32px] shadow-lg space-y-6 relative print:border-none print:shadow-none">
            
            {/* Stamp logo */}
            <div className="flex justify-between items-start border-b border-border-color pb-4">
              <div>
                <h3 className="text-xl font-serif font-medium text-navy">Amore <span className="text-orange font-serif">Cakes</span></h3>
                <p className="text-[10px] text-navy/50 font-medium uppercase tracking-wider mt-0.5">Boutique Invoices Dept</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-medium text-navy">Invoice No: {placedOrder.invoiceNumber}</p>
                <p className="text-navy/50 font-medium mt-0.5">Date: {new Date().toISOString().slice(0,10)}</p>
              </div>
            </div>

            {/* Recipient info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-border-color pb-4 font-normal text-navy">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-medium tracking-wider text-navy/55">Customer Details</p>
                <p className="font-serif font-medium text-sm">{placedOrder.shippingAddress.name}</p>
                <p className="text-navy/65 font-normal leading-relaxed">
                  {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.city}, <br />
                  {placedOrder.shippingAddress.state} - {placedOrder.shippingAddress.zipCode}
                </p>
                <p className="text-[10px] font-medium text-navy/55 pt-1">Contact: {placedOrder.shippingAddress.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-medium tracking-wider text-navy/55">Scheduled Delivery</p>
                <p className="font-serif font-medium text-sm">Date: {placedOrder.deliveryDetails.date}</p>
                <p className="text-navy/65 font-normal">Slot: {placedOrder.deliveryDetails.timeSlot}</p>
                <p className="text-navy/65 font-normal">Shipping type: {placedOrder.deliveryDetails.type}</p>
              </div>
            </div>

            {/* Invoice Line items list */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-medium tracking-wider text-navy/50">Itemized Breakdown</p>
              <table className="w-full text-left border-collapse text-xs text-navy font-normal">
                <thead>
                  <tr className="border-b border-border-color pb-2 text-navy/60">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Each</th>
                    <th className="py-2 text-right">Sum</th>
                  </tr>
                </thead>
                <tbody>
                  {placedOrder.items.map((item, i) => (
                    <tr key={i} className="border-b border-border-color/50">
                      <td className="py-2.5">
                        <span className="font-serif font-medium block">{item.name}</span>
                        <span className="text-[9px] text-navy/50 font-normal">Weight: {item.weight} | Flavor: {item.flavor}</span>
                      </td>
                      <td className="py-2.5 text-center">{item.quantity}</td>
                      <td className="py-2.5 text-right">₹{item.price}</td>
                      <td className="py-2.5 text-right">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Pricing Totals splits */}
            <div className="flex justify-end pt-4 border-t border-border-color text-xs font-normal text-navy">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span>₹{placedOrder.pricing.subtotal}</span>
                </div>
                {placedOrder.pricing.discountApplied > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Coupon Discount Applied</span>
                    <span>- ₹{placedOrder.pricing.discountApplied}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Food CGST & SGST (5%)</span>
                  <span>₹{placedOrder.pricing.gstAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Delivery Fee</span>
                  <span>₹{placedOrder.pricing.shippingCharge}</span>
                </div>
                <div className="flex justify-between border-t border-border-color pt-2 font-serif font-medium text-sm text-navy">
                  <span>Invoice Total</span>
                  <span className="text-orange">₹{placedOrder.pricing.totalAmount}</span>
                </div>

                {/* COD specifics */}
                {placedOrder.payment.method === 'COD' && (
                  <div className="border-t border-dashed border-border-color pt-2 text-[10px] space-y-1 text-navy/70 font-normal">
                    <div className="flex justify-between font-medium">
                      <span>30% Advance Paid Online:</span>
                      <span>₹{placedOrder.payment.advancePaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>70% Balance Payable:</span>
                      <span>₹{placedOrder.payment.balanceDue}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Action buttons paths hides in print layout */}
          <div className="flex flex-wrap gap-4 justify-center print:hidden">
            <button 
              onClick={handlePrintInvoice}
              className="bg-navy hover:bg-navy-dark text-white font-medium py-3 px-8 rounded-full text-xs transition-colors shadow-md flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print / Download Invoice
            </button>
            <Link 
              href="/dashboard?tab=orders"
              className="bg-orange hover:bg-orange-hover text-white font-medium py-3 px-8 rounded-full text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" /> Track Shipments Timeline
            </Link>
            <Link 
              href="/"
              className="bg-cream hover:bg-cream/80 text-navy font-medium py-3 px-8 rounded-full text-xs transition-colors border border-border-color flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Return to Homepage
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center py-24 bg-background text-navy gap-3">
        <div className="w-12 h-12 border-t-2 border-b-2 border-orange rounded-full animate-spin"></div>
        <span className="font-sans font-medium animate-pulse uppercase tracking-wider text-xs">Loading Invoice...</span>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
