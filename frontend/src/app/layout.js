'use client';
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import './globals.css';
import { 
  Search, ShoppingBag, Heart, User, MapPin, ChevronDown, 
  Sun, Moon, Sparkles, Phone, Mail, Menu, X, Mic, Send, Globe,
  ShieldCheck, CreditCard, Award
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function GlobalLayout({ children }) {
  const { 
    cart, wishlist, user, logout, loginWithGoogle,
    selectedLocation, setSelectedLocation, searchQuery, setSearchQuery,
    theme, toggleTheme, toast, setToast, categories
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const router = useRouter();

  // Voice Search Mock Trigger
  const handleVoiceSearch = () => {
    setVoiceActive(true);
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setSearchQuery(text);
        setVoiceActive(false);
        router.push(`/category/all?search=${encodeURIComponent(text)}`);
      };

      recognition.onerror = () => setVoiceActive(false);
      recognition.onend = () => setVoiceActive(false);
      recognition.start();
    } else {
      setTimeout(() => {
        setSearchQuery('Chocolate Cake');
        setVoiceActive(false);
        router.push(`/category/all?search=chocolate`);
      }, 1500);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/category/all');
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen flex flex-col relative bg-background text-foreground`}>
      
      {/* UPPERMOST ANNOUNCEMENT BAR */}
      <div className="bg-navy text-background text-xs py-2 px-4 text-center font-medium tracking-wider flex justify-between items-center z-50 print:hidden">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-bounce" />
          <span>CELEBRATE WITH <b className="text-gold uppercase tracking-widest font-black">AMORE CAKES</b>: GET 15% OFF! USE CODE: <b className="text-gold bg-background/10 px-2 py-0.5 rounded">WELCOME15</b></span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-background/85 font-semibold">
          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-gold" /> Call: +91 98765 43210</span>
          <span>Same Day Free Midnight Delivery in Metro Cities!</span>
        </div>
      </div>

      {/* STICKY MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border-color shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo on Left */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-1.5 hover:bg-cream rounded-full text-navy transition-all duration-200"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tight text-navy font-serif flex items-center gap-1 transition-transform group-hover:scale-102">
                Amore<span className="text-orange">Cakes</span>
                <span className="text-[10px] bg-orange/15 text-orange font-sans uppercase px-2 py-0.5 rounded-full font-black tracking-wider ml-1">Boutique</span>
              </span>
            </Link>
          </div>

          {/* Location Picker */}
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold hover:text-orange cursor-pointer py-1.5 px-3 rounded-full bg-cream/40 border border-border-color transition-all hover:border-orange/50 shadow-sm">
            <MapPin className="w-4 h-4 text-orange" />
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent border-none text-navy font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="Mumbai, MH">Mumbai, MH</option>
              <option value="Delhi, DL">Delhi NCR</option>
              <option value="Bangalore, KA">Bangalore, KA</option>
              <option value="Pune, MH">Pune, MH</option>
              <option value="Kolkata, WB">Kolkata, WB</option>
            </select>
          </div>

          {/* Central Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg relative hidden sm:flex items-center border border-border-color bg-cream/20 rounded-full py-1.5 px-4 focus-within:ring-2 focus-within:ring-orange/50 focus-within:border-transparent transition-all shadow-inner">
            <Search className="w-4 h-4 text-navy/45 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search for eggless cakes, gourmet cupcakes, pastries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-navy placeholder-navy/45 font-medium"
            />
            <button 
              type="button" 
              onClick={handleVoiceSearch}
              className={`p-1 hover:bg-cream rounded-full transition-colors ${voiceActive ? 'text-red-500 animate-pulse' : 'text-navy/60'}`}
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>

          {/* Right Nav Action Panel */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 hover:bg-cream rounded-full text-navy transition-all hover:scale-105"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gold" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 text-sm font-semibold hover:text-orange cursor-pointer py-1.5 px-3 rounded-full hover:bg-cream transition-all border border-transparent hover:border-border-color"
                  >
                    <img 
                      src={user.avatar} 
                      alt="avatar" 
                      className="w-7 h-7 rounded-full border border-orange object-cover"
                    />
                    <span className="hidden md:block max-w-[80px] truncate text-navy font-bold">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-navy/60" />
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-card-bg border border-border-color rounded-2xl shadow-xl py-2 z-50 animate-float">
                      <div className="px-4 py-2 border-b border-border-color text-xs text-navy/60">
                        Logged in as <b className="text-navy block truncate font-bold">{user.email}</b>
                      </div>
                      <Link href="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-cream text-navy transition-colors font-semibold">
                        User Dashboard
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-cream text-orange transition-colors font-bold flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-orange" /> Admin Dashboard
                        </Link>
                      )}
                      <Link href="/dashboard?tab=orders" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-cream text-navy transition-colors font-semibold">
                        Order History
                      </Link>
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-500 transition-colors font-bold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={loginWithGoogle}
                  className="flex items-center gap-1.5 text-xs font-bold bg-orange hover:bg-orange-hover text-white transition-all py-2 px-4 rounded-full shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Google Login</span>
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link href="/dashboard?tab=wishlist" className="relative p-2 hover:bg-cream rounded-full text-navy transition-colors" title="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 hover:bg-cream rounded-full text-navy transition-colors" title="Cart Drawer">
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-orange text-white font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-card-bg shadow-sm">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* SECONDARY CATEGORY NAVBAR */}
      <nav className="bg-cream border-b border-border-color text-navy font-semibold overflow-x-auto no-scrollbar py-2.5 px-4 sticky top-[61px] z-30 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-xs tracking-wide uppercase font-black whitespace-nowrap">
          <Link href="/category/all" className="hover:text-orange transition-all pb-1 border-b-2 border-transparent hover:border-orange">
            Shop All
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/category/${cat.slug}`} 
              className="hover:text-orange transition-all pb-1 border-b-2 border-transparent hover:border-orange flex items-center gap-1"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/about" className="hover:text-orange text-orange font-black tracking-widest pb-1 border-b-2 border-transparent hover:border-orange">
            Our Story / Contact
          </Link>
        </div>
      </nav>

      {/* MAIN WEBSITE CONTENT PAGES */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* PREMIUM NEWSLETTER SECTION (HOME/GLOBAL LAYOUT COMPONENT) */}
      <section className="bg-cream border-t border-border-color py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-serif text-navy font-black">Join the Amore Cakes Connoisseurs</h2>
          <p className="text-navy/70 text-sm max-w-md mx-auto font-medium">Subscribe for early access to boutique baking masterclasses, holiday discount keys, and exclusive gourmet previews!</p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully with mock code AMORE15! Check your email.'); }} className="flex max-w-md mx-auto gap-2 bg-card-bg p-1.5 rounded-full border border-border-color focus-within:ring-2 focus-within:ring-orange/50 shadow-md">
            <Mail className="w-5 h-5 text-navy/45 ml-3 self-center" />
            <input 
              type="email" 
              placeholder="Enter your email to receive 15% off..." 
              required 
              className="w-full bg-transparent outline-none text-sm px-2 text-navy placeholder-navy/45 font-semibold"
            />
            <button type="submit" className="bg-orange hover:bg-orange-hover text-white font-bold py-2.5 px-6 rounded-full text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm">
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* ROBUST FOOTER COMPONENT */}
      <footer className="bg-navy text-background/95 pt-16 pb-8 border-t-4 border-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-black text-white tracking-tight">Amore<span className="text-orange">Cakes</span></h3>
            <p className="text-xs text-background/70 leading-relaxed font-medium">
              Amore Cakes is India&apos;s premier luxury boutique bakery, handcrafting spectacular celebratory cakes, customized gourmet pastries, and masterclass confectionery. We promise pure freshness, exquisite aesthetics, and free same-day midnight home delivery.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-background/10 hover:bg-orange/20 hover:text-orange rounded-full transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-background/10 hover:bg-orange/20 hover:text-orange rounded-full transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.9.1-1.3 1.3-1.3H15V2h-2.6C9.5 2 9 3.5 9 5.5V8z" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-background/10 hover:bg-orange/20 hover:text-orange rounded-full transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-background/10 pb-2">The Sweet Menu</h4>
            <ul className="text-xs space-y-2.5 text-background/70 font-semibold">
              <li><Link href="/category/birthday-cakes" className="hover:text-orange transition-colors">Birthday Cakes Specials</Link></li>
              <li><Link href="/category/wedding-cakes" className="hover:text-orange transition-colors">Luxury Wedding Masterpieces</Link></li>
              <li><Link href="/category/cupcakes" className="hover:text-orange transition-colors">Artisanal Cream Cupcakes</Link></li>
              <li><Link href="/category/eggless-cakes" className="hover:text-orange transition-colors">Pure Eggless Collection</Link></li>
              <li><Link href="/category/combos" className="hover:text-orange transition-colors">Flowers, Cakes & Gifts Combos</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-background/10 pb-2">Support & Info</h4>
            <ul className="text-xs space-y-2.5 text-background/70 font-semibold">
              <li><Link href="/about" className="hover:text-orange transition-colors">About Our Boutique Bakery</Link></li>
              <li><Link href="/dashboard?tab=orders" className="hover:text-orange transition-colors">Track Active Shipment</Link></li>
              <li><Link href="/about" className="hover:text-orange transition-colors">Delivery Cities & Details</Link></li>
              <li><Link href="/about" className="hover:text-orange transition-colors">Refund & Return Guidelines</Link></li>
              <li><Link href="/about" className="hover:text-orange transition-colors">Contact Cust Support Helpdesk</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-background/10 pb-2">Contact Boutique</h4>
            <ul className="text-xs space-y-3 text-background/70 font-semibold">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange shrink-0 mt-0.5" />
                <span>Amore Cakes HQ, Level 3, Creative Bakers Complex, Worli, Mumbai, MH - 400018</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange shrink-0" />
                <span>+91 98765 43210 (Mon-Sun 8 AM - 11 PM)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange shrink-0" />
                <span>orders@amorecakes.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* TRUST BADGES AND COPYRIGHT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-background/10 text-center flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-background/50">
          <div className="flex flex-wrap justify-center gap-6 font-semibold">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-orange" /> 100% Certified Safe Checkout</span>
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-orange" /> COD, UPI, & Razorpay Verified</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-orange" /> 5-Star Food Grade Bakery Rating</span>
          </div>
          <div className="font-semibold">
            &copy; 2026 Amore Cakes Ltd. All rights reserved. Designed with premium bakery aesthetics.
          </div>
        </div>
      </footer>

      {/* MOBILE LOWER ACTION BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card-bg/95 border-t border-border-color py-2.5 px-6 flex justify-between items-center z-40 shadow-xl">
        <Link href="/" className="flex flex-col items-center gap-1 text-navy text-[10px] font-bold">
          <Sparkles className="w-5 h-5 text-orange" />
          <span>Home</span>
        </Link>
        <Link href="/category/all" className="flex flex-col items-center gap-1 text-navy text-[10px] font-bold">
          <Search className="w-5 h-5 text-orange" />
          <span>Browse</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center gap-1 text-navy text-[10px] font-bold relative">
          <ShoppingBag className="w-5 h-5 text-orange" />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-orange text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-card-bg">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-navy text-[10px] font-bold">
          <User className="w-5 h-5 text-orange" />
          <span>Account</span>
        </Link>
      </div>

      {/* GLOBAL BANNER TOASTS WRAPPER */}
      {toast && (
        <div className="fixed bottom-18 sm:bottom-6 right-6 bg-navy text-white py-3 px-5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-orange/40 animate-float max-w-sm">
          <Sparkles className="w-5 h-5 text-orange shrink-0 animate-pulse" />
          <div className="text-xs font-bold leading-tight flex-grow">{toast.message}</div>
          <button onClick={() => setToast(null)} className="text-white/50 hover:text-white font-bold ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MOBILE OVERLAY SITEMAP DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-80 max-w-xs bg-card-bg h-full p-6 flex flex-col justify-between shadow-2xl animate-slide-right border-r border-border-color">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-color">
                <span className="text-xl font-serif font-black text-navy">Amore<span className="text-orange">Cakes</span></span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-cream rounded-full text-navy"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-4">
                {/* Mobile Search inside Drawer */}
                <form 
                  onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} 
                  className="flex items-center border border-border-color bg-cream/30 rounded-full py-2 px-4 shadow-inner"
                >
                  <Search className="w-4 h-4 text-navy/45 mr-2 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search cakes, desserts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs text-navy placeholder-navy/45 font-semibold"
                  />
                </form>

                <h4 className="text-xs font-bold text-navy/50 uppercase tracking-widest pt-2">Our Cake Menu</h4>
                <div className="flex flex-col gap-3 font-semibold text-sm">
                  <Link href="/category/all" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange text-navy transition-colors">Shop All Categories</Link>
                  {categories.slice(0, 8).map(c => (
                    <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setMobileMenuOpen(false)} className="hover:text-orange text-navy transition-colors">{c.name}</Link>
                  ))}
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange text-navy font-black tracking-widest transition-colors pt-2 border-t border-border-color">Our Boutique Story / Help</Link>
                </div>
              </div>
            </div>
            <div className="text-xs text-navy/60 border-t border-border-color pt-4 space-y-2">
              <p className="font-bold flex items-center gap-1 text-navy"><Phone className="w-3.5 h-3.5 text-orange" /> Call Boutique: +91 98765 43210</p>
              <p>&copy; 2026 Amore Cakes Bakery.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <title>Amore Cakes - Premium Artisanal Cake Shop & Delivery</title>
        <meta name="description" content="Order fresh customized birthday cakes, wedding cakes, pastries, cupcakes and gift combos from Amore Cakes. Free midnight delivery, premium chocolate & eggless cakes." />
      </head>
      <body>
        <AppProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </AppProvider>
      </body>
    </html>
  );
}
