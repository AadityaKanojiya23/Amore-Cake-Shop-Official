'use client';
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import './globals.css';
import { 
  Search, ShoppingBag, Heart, User, MapPin, ChevronDown, 
  Sun, Moon, Sparkles, Phone, Mail, Menu, X, Mic, Send, Globe,
  ShieldCheck, CreditCard, Award, Lock, Eye, EyeOff, Plus, CheckCircle, ArrowRight, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const megaMenus = {
  'all': {
    col1: {
      title: 'Top Categories',
      links: [
        { name: 'Artisanal Cakes', href: '/category/cakes' },
        { name: 'Birthday Specials', href: '/category/birthday-cakes' },
        { name: 'Wedding Masterpieces', href: '/category/wedding-cakes' },
        { name: 'Anniversary Collection', href: '/category/anniversary-cakes' },
        { name: 'Chocolate Decadence', href: '/category/chocolate-cakes' }
      ]
    },
    col2: {
      title: 'Gourmet Creations',
      links: [
        { name: 'Designer Themes', href: '/category/designer-cakes' },
        { name: 'Korean Bento Minis', href: '/category/bento-cakes' },
        { name: 'Cupcakes & Pastries', href: '/category/cupcakes' },
        { name: 'Pure Eggless Selection', href: '/category/eggless-cakes' },
        { name: 'Gourmet Photo Prints', href: '/category/photo-cakes' }
      ]
    }
  },
  'cakes': {
    col1: {
      title: 'By Style',
      links: [
        { name: 'All Cakes', href: '/category/cakes' },
        { name: 'Eggless Cakes', href: '/category/eggless-cakes' },
        { name: 'Photo Cakes', href: '/category/photo-cakes' },
        { name: 'Pinata Cakes', href: '/category/cakes?sub=pinata' },
        { name: 'Pull Me Up Cakes', href: '/category/cakes?sub=pull-me-up' },
        { name: 'Heart Shaped Cakes', href: '/category/cakes?sub=heart' }
      ]
    },
    col2: {
      title: 'By Weight',
      links: [
        { name: 'Half KG Cakes', href: '/category/cakes?weight=0.5' },
        { name: '1 KG Cakes', href: '/category/cakes?weight=1' },
        { name: '2 KG Cakes', href: '/category/cakes?weight=2' },
        { name: 'Multi-Tier Celebration', href: '/category/wedding-cakes' }
      ]
    }
  },
  'birthday-cakes': {
    col1: {
      title: 'By Recipient',
      links: [
        { name: 'For Kids 🎈', href: '/category/birthday-cakes?recipient=kids' },
        { name: 'For Him 👨', href: '/category/birthday-cakes?recipient=him' },
        { name: 'For Her 👩', href: '/category/birthday-cakes?recipient=her' },
        { name: 'For Parents 💖', href: '/category/birthday-cakes?recipient=parents' },
        { name: 'Milestone Birthdays', href: '/category/birthday-cakes?recipient=milestone' }
      ]
    },
    col2: {
      title: 'Trending Themes',
      links: [
        { name: 'Custom Theme Cakes', href: '/category/designer-cakes' },
        { name: 'Barbie Princess Cakes', href: '/category/designer-cakes?theme=barbie' },
        { name: 'Superhero Cakes', href: '/category/designer-cakes?theme=superhero' },
        { name: 'Crown & Tiara Cakes', href: '/category/designer-cakes?theme=crown' }
      ]
    }
  },
  'wedding-cakes': {
    col1: {
      title: 'Bespoke Styles',
      links: [
        { name: 'Floral Wedding Cakes 🌸', href: '/category/wedding-cakes?style=floral' },
        { name: 'Tiered Fondant', href: '/category/wedding-cakes?style=fondant' },
        { name: 'Elegant Naked Cakes', href: '/category/wedding-cakes?style=naked' },
        { name: 'Metallic Gold Accents', href: '/category/wedding-cakes?style=gold' }
      ]
    },
    col2: {
      title: 'Premium Flavors',
      links: [
        { name: 'Red Velvet Cream Cheese', href: '/category/wedding-cakes?flavor=red-velvet' },
        { name: 'Belgian Truffle Decadence', href: '/category/wedding-cakes?flavor=truffle' },
        { name: 'Classic Madagascar Vanilla', href: '/category/wedding-cakes?flavor=vanilla' },
        { name: 'Hazelnut Praline Delight', href: '/category/wedding-cakes?flavor=hazelnut' }
      ]
    }
  },
  'anniversary-cakes': {
    col1: {
      title: 'By Milestone',
      links: [
        { name: '25th Silver Jubilee 🥈', href: '/category/anniversary-cakes?milestone=25th' },
        { name: '50th Golden Jubilee 🥇', href: '/category/anniversary-cakes?milestone=50th' },
        { name: '1st Anniversary Love', href: '/category/anniversary-cakes?milestone=1st' },
        { name: 'Heart-Shaped Specials', href: '/category/anniversary-cakes?theme=heart' }
      ]
    },
    col2: {
      title: 'By Relationship',
      links: [
        { name: 'For Husband & Wife', href: '/category/anniversary-cakes?for=spouse' },
        { name: 'For Mom & Dad 👨‍👩‍👧', href: '/category/anniversary-cakes?for=parents' },
        { name: 'For Premium Couples', href: '/category/anniversary-cakes?for=couples' }
      ]
    }
  },
  'chocolate-cakes': {
    col1: {
      title: 'Rich & Intense',
      links: [
        { name: 'Belgian Truffle Cake 🍫', href: '/category/chocolate-cakes?type=truffle' },
        { name: 'Dark Ganache Decadence', href: '/category/chocolate-cakes?type=dark' },
        { name: 'Chocolate Mud Overload', href: '/category/chocolate-cakes?type=mud' },
        { name: 'Death By Chocolate 💀', href: '/category/chocolate-cakes?type=death' }
      ]
    },
    col2: {
      title: 'Gourmet Fusions',
      links: [
        { name: 'Chocolate Caramel Crunch', href: '/category/chocolate-cakes?type=caramel' },
        { name: 'Nutella Hazelnut Premium', href: '/category/chocolate-cakes?type=nutella' },
        { name: 'Ferrero Rocher Delight', href: '/category/chocolate-cakes?type=ferrero' },
        { name: 'Oreo Chocolate Smash', href: '/category/chocolate-cakes?type=oreo' }
      ]
    }
  },
  'designer-cakes': {
    col1: {
      title: 'Modern Artistry',
      links: [
        { name: 'Hand-Painted Cakes 🎨', href: '/category/designer-cakes?type=painted' },
        { name: 'Abstract Buttercream', href: '/category/designer-cakes?type=abstract' },
        { name: 'Textured Marble Finishes', href: '/category/designer-cakes?type=marble' },
        { name: 'Geode Crystal Designs', href: '/category/designer-cakes?type=geode' }
      ]
    },
    col2: {
      title: 'Gourmet Inlays',
      links: [
        { name: 'Macaron Loaded Cakes', href: '/category/designer-cakes?type=macaron' },
        { name: 'Isomalt Glass Tiaras 👑', href: '/category/designer-cakes?type=tiara' },
        { name: 'Edible Gold Leaf Accented', href: '/category/designer-cakes?type=gold' }
      ]
    }
  },
  'cupcakes': {
    col1: {
      title: 'Artisanal Flavors',
      links: [
        { name: 'Red Velvet Rosette 🧁', href: '/category/cupcakes?flavor=red-velvet' },
        { name: 'Double Chocolate Fudge', href: '/category/cupcakes?flavor=chocolate' },
        { name: 'Classic Madagascar Bean', href: '/category/cupcakes?flavor=vanilla' },
        { name: 'Salted Caramel Drizzle', href: '/category/cupcakes?flavor=caramel' }
      ]
    },
    col2: {
      title: 'Celebration Boxes',
      links: [
        { name: 'Assorted Party Box (6)', href: '/category/cupcakes?box=6' },
        { name: 'Deluxe Celebration Box (12)', href: '/category/cupcakes?box=12' },
        { name: 'Custom Inscribed Message', href: '/category/cupcakes?box=message' },
        { name: 'Mini Flowerpot Cupcakes', href: '/category/cupcakes?box=flower' }
      ]
    }
  },
  'pastries': {
    col1: {
      title: 'Gourmet Slices',
      links: [
        { name: 'Fresh Fruit Gateau 🍓', href: '/category/pastries?type=fruit' },
        { name: 'Belgian Truffle Slice', href: '/category/pastries?type=truffle' },
        { name: 'Classic Red Velvet', href: '/category/pastries?type=red-velvet' },
        { name: 'Black Forest Elite', href: '/category/pastries?type=black-forest' }
      ]
    },
    col2: {
      title: 'French Delicacies',
      links: [
        { name: 'Gourmet Choco Eclairs', href: '/category/pastries?type=eclairs' },
        { name: 'Luxury Mille-Feuille', href: '/category/pastries?type=mille-feuille' },
        { name: 'Gourmet Tiramisu Cups', href: '/category/pastries?type=tiramisu' },
        { name: 'Assorted Macaron Box', href: '/category/pastries?type=macarons' }
      ]
    }
  },
  'bento-cakes': {
    col1: {
      title: 'Aesthetic Minis',
      links: [
        { name: 'Korean Bento Cakes 🇰🇷', href: '/category/bento-cakes?type=korean' },
        { name: 'Minimalist Pastel Bentos', href: '/category/bento-cakes?type=pastel' },
        { name: 'Cute Custom Message', href: '/category/bento-cakes?type=message' },
        { name: 'Heart Shape Bentos 💖', href: '/category/bento-cakes?type=heart' }
      ]
    },
    col2: {
      title: 'Bento Gift Packs',
      links: [
        { name: 'Bento + 2 Cupcakes Combo', href: '/category/bento-cakes?pack=cupcakes' },
        { name: 'Bento + Assorted Pastry Pack', href: '/category/bento-cakes?pack=pastries' },
        { name: 'Bento Flower Gift Set 💐', href: '/category/bento-cakes?pack=flower' }
      ]
    }
  },
  'photo-cakes': {
    col1: {
      title: 'Interactive Prints',
      links: [
        { name: 'High-Def Edible Photos 📸', href: '/category/photo-cakes?type=hd' },
        { name: 'Square Poster Cakes', href: '/category/photo-cakes?type=square' },
        { name: 'Round Photo Borders', href: '/category/photo-cakes?type=round' },
        { name: 'Collage Memories Cake', href: '/category/photo-cakes?type=collage' }
      ]
    },
    col2: {
      title: 'Occasion Specials',
      links: [
        { name: 'Corporate Logo Cakes 🏢', href: '/category/photo-cakes?type=corporate' },
        { name: 'Kids Cartoon Prints', href: '/category/photo-cakes?type=cartoon' },
        { name: 'Retro Polaroid Cakes', href: '/category/photo-cakes?type=retro' }
      ]
    }
  },
  'eggless-cakes': {
    col1: {
      title: 'Veggie Classics',
      links: [
        { name: 'Eggless Belgian Truffle 🥦', href: '/category/eggless-cakes?type=truffle' },
        { name: 'Eggless Fresh Fruit Cake', href: '/category/eggless-cakes?type=fruit' },
        { name: 'Eggless Butterscotch Crunch', href: '/category/eggless-cakes?type=butterscotch' },
        { name: 'Eggless Royal Pineapple', href: '/category/eggless-cakes?type=pineapple' }
      ]
    },
    col2: {
      title: 'Healthy Alternatives',
      links: [
        { name: 'Sugar-Free Eggless Truffle', href: '/category/eggless-cakes?type=sugar-free' },
        { name: 'Gluten-Free Eggless Cake', href: '/category/eggless-cakes?type=gluten-free' },
        { name: 'Pure Vegan Chocolate 🥑', href: '/category/eggless-cakes?type=vegan' }
      ]
    }
  }
};

// Tree Node with expand/collapse capability for Varieties Sidebar
function CategoryTreeNode({ title, links, isOpenDefault = false, onLinkClick }) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div className="border border-border-color/60 dark:border-white/10 rounded-xl overflow-hidden bg-cream/10 dark:bg-white/5 shadow-xs transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-cream/20 hover:bg-cream/40 dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-left"
      >
        <span className="font-extrabold text-xs text-navy dark:text-white tracking-wide">{title}</span>
        <span className="text-navy/40 dark:text-white/40 text-[10px] transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="px-4 py-2 border-t border-border-color/40 dark:border-white/5 bg-white dark:bg-transparent transition-all duration-300">
          <ul className="space-y-2.5 py-1">
            {links.map((lnk, i) => (
              <li key={i} className="flex items-center gap-2 pl-1 relative group/item">
                {/* Tree bullet circle indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-orange/40 group-hover/item:bg-orange transition-colors"></div>
                <Link 
                  href={lnk.href}
                  onClick={onLinkClick}
                  className="text-navy/80 dark:text-white/80 hover:text-orange dark:hover:text-orange font-bold text-[11px] transition-colors py-0.5"
                >
                  {lnk.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function GlobalLayout({ children }) {
  const { 
    cart, wishlist, user, logout, loginWithGoogle, login, register, addAddress,
    selectedLocation, setSelectedLocation, searchQuery, setSearchQuery,
    theme, toggleTheme, toast, setToast, categories
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allDrawerOpen, setAllDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div className="bg-navy text-background text-xs py-2 px-4 text-center font-medium tracking-wider flex md:justify-between justify-center items-center z-50 print:hidden flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-bounce" />
          <span>CELEBRATE WITH <b className="text-gold uppercase tracking-widest font-black">AMORE CAKES</b>: GET 15% OFF! USE CODE: <b className="text-gold bg-background/10 px-2 py-0.5 rounded">WELCOME15</b></span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-background/85 font-semibold">
          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-gold" /> Call: +91 98765 43210</span>
          <span>Same Day Free Midnight Delivery in Metro Cities!</span>
        </div>
      </div>

      {/* STICKY HEADER & NAVIGATION CONTAINER */}
      <div className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'fixed top-0 left-0 right-0 z-40 shadow-lg backdrop-blur-md bg-background/80 border-b border-border-color/40 animate-slide-down' 
          : 'relative z-40'
      }`}>
        {/* STICKY MAIN NAVBAR */}
        <header className={`relative z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-transparent border-b border-transparent shadow-none backdrop-blur-none' 
            : 'bg-background/95 backdrop-blur-sm border-b border-border-color shadow-sm'
        }`}>
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
            isScrolled ? 'py-1.5' : 'py-3'
          }`}>
            
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
              {/* Theme Toggle (Desktop/Tablet only) */}
              <button 
                onClick={toggleTheme} 
                className="p-2 hover:bg-cream rounded-full text-navy transition-all hover:scale-105 hidden sm:block"
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
                    onClick={() => loginWithGoogle()}
                    className="flex items-center gap-1.5 text-xs font-bold bg-orange hover:bg-orange-hover text-white transition-all py-2 px-4 rounded-full shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Login / Sign Up</span>
                  </button>
                )}
              </div>

              {/* Wishlist Icon (Desktop/Tablet only) */}
              <Link href="/dashboard?tab=wishlist" className="relative p-2 hover:bg-cream rounded-full text-navy transition-colors hidden sm:block" title="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white font-extrabold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
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

        <nav className={`relative z-40 text-navy font-medium overflow-x-auto lg:overflow-visible no-scrollbar px-4 transition-all duration-300 ${
          isScrolled 
            ? 'bg-cream/90 py-1.5 shadow-sm border-b border-border-color/30 backdrop-blur-md' 
            : 'bg-cream border-b border-border-color py-2.5 shadow-sm'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 xl:gap-4 text-xs tracking-wide font-medium whitespace-nowrap lg:overflow-visible w-full font-sans">
            
            {/* Left aligned items container to keep items nicely grouped */}
            <div className="flex items-center gap-2 lg:overflow-visible h-full">
              {/* Shop All Menu Item (☰ All) */}
              <div className="relative group lg:overflow-visible flex items-center h-full">
                {/* Left vertical border divider */}
                <div className="h-5 border-l border-border-color absolute left-0 top-1/2 -translate-y-1/2"></div>
                
                <Link 
                  href="/category/all" 
                  onClick={(e) => { e.preventDefault(); setAllDrawerOpen(true); }}
                  className="text-navy hover:text-orange px-2.5 py-1.5 transition-colors flex items-center gap-1.5 font-medium text-xs ml-1 mr-1 normal-case"
                >
                  <Menu className="w-4 h-4 text-navy group-hover:text-orange shrink-0 transition-colors" />
                  <span>All</span>
                </Link>
                
                {/* Right vertical border divider */}
                <div className="h-5 border-r border-border-color my-auto"></div>
                

              </div>


              {/* Dynamic Categories Loops */}
              {categories
                .filter((cat) => ['cakes', 'cupcakes', 'pastries', 'bento-cakes', 'photo-cakes', 'eggless-cakes'].includes(cat.slug))
                .map((cat, index, filteredArray) => {
                  const menu = megaMenus[cat.slug];
                  const isLastFew = index >= filteredArray.length - 2;
                  let alignmentClass = 'left-1/2 -translate-x-1/2';
                  if (index === 0) {
                    alignmentClass = 'left-0 translate-x-0';
                  } else if (index === 1) {
                    alignmentClass = 'left-0 -translate-x-1/4';
                  } else if (isLastFew) {
                    alignmentClass = 'right-0 left-auto translate-x-0';
                  }
                  return (
                    <div key={cat.slug} className="relative group lg:overflow-visible flex items-center">
                      <Link 
                        href={`/category/${cat.slug}`} 
                        className="text-navy hover:text-orange px-2 py-1.5 transition-all flex items-center gap-1 font-medium text-xs normal-case"
                      >
                        <span>{cat.name}</span>
                        {menu && <span className="text-navy/40 group-hover:text-orange/60 text-[8px] ml-0.5 transition-colors">▼</span>}
                      </Link>
                      
                      {/* Mega Dropdown Menu */}
                      {menu && (
                        <div className={`absolute top-full ${alignmentClass} mt-2 w-[460px] bg-white dark:bg-[#0D2A6B] border border-border-color/80 rounded-2xl shadow-xl z-50 transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 duration-200 pointer-events-none group-hover:pointer-events-auto flex overflow-hidden text-left font-sans normal-case tracking-normal border-t-2 border-t-orange`}>
                          
                          {/* Column 1: White Background */}
                          <div className="w-1/2 p-4 bg-white dark:bg-[#123175] space-y-3 shrink-0">
                            <h5 className="text-[10px] font-black uppercase text-navy/40 dark:text-white/45 tracking-widest flex items-center gap-1.5 border-b border-border-color/40 pb-1.5">
                              <span className="text-orange text-[12px] leading-none">✦</span> {menu.col1.title}
                            </h5>
                            <ul className="space-y-2">
                              {menu.col1.links.map((lnk, i) => (
                                <li key={i}>
                                  <Link 
                                    href={lnk.href}
                                    className="block text-navy/80 dark:text-white/80 hover:text-orange dark:hover:text-orange font-bold text-[11px] transition-colors py-0.5"
                                  >
                                    {lnk.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Column 2: Soft Cream Background */}
                          <div className="w-1/2 p-4 bg-[#FFF9F2] dark:bg-[#0D2A6B]/30 border-l border-border-color/40 space-y-3 shrink-0">
                            <h5 className="text-[10px] font-black uppercase text-orange tracking-widest flex items-center gap-1.5 border-b border-orange/10 pb-1.5">
                              <span className="text-orange text-[12px] leading-none">✦</span> {menu.col2.title}
                            </h5>
                            <ul className="space-y-2">
                              {menu.col2.links.map((lnk, i) => (
                                <li key={i}>
                                  <Link 
                                    href={lnk.href}
                                    className="block text-navy/80 dark:text-white/80 hover:text-orange dark:hover:text-orange font-bold text-[11px] transition-colors py-0.5"
                                  >
                                    {lnk.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}

              <Link 
                href="/about" 
                className="text-navy hover:text-orange px-2 py-1.5 transition-colors flex items-center gap-1 font-medium text-xs normal-case"
              >
                Our Story
              </Link>
            </div>


          </div>
        </nav>
      </div>
      {isScrolled && <div className="h-[105px] md:h-[120px] print:hidden" />}

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

      {/* ALL VARIETIES TREE-TYPE SIDEBAR DRAWER */}
      {allDrawerOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Overlay with smooth backdrop blur */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setAllDrawerOpen(false)}
          ></div>
          
          {/* Sidebar Panel */}
          <div className="relative w-80 max-w-sm bg-white dark:bg-[#0D1B3E] h-full shadow-2xl flex flex-col z-50 animate-slide-right border-r border-border-color">
            
            {/* Sidebar Header */}
            <div className="bg-navy text-white px-5 py-4.5 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-orange shrink-0 animate-pulse" />
                <span className="font-serif font-black text-base tracking-wide">
                  All <span className="text-orange">Varieties</span>
                </span>
              </div>
              <button 
                onClick={() => setAllDrawerOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tree Navigation Area */}
            <div className="flex-grow overflow-y-auto p-5 space-y-5 select-none no-scrollbar">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-navy/40 dark:text-white/40 uppercase tracking-widest border-b border-border-color/40 pb-2">
                  Browse by Boutique Departments
                </h4>
                
                {/* TREE-TYPE ACCORDION ROOT */}
                <div className="space-y-3 font-sans">
                  
                  {/* Category Node 1: Celebration & Milestone Cakes */}
                  <CategoryTreeNode 
                    title="🎂 Celebration & Milestones" 
                    isOpenDefault={true}
                    links={[
                      { name: "Artisanal Cakes (All)", href: "/category/cakes" },
                      { name: "Half KG Celebration Cakes", href: "/category/cakes?weight=0.5" },
                      { name: "1 KG Boutique Cakes", href: "/category/cakes?weight=1" },
                      { name: "2 KG Grand Party Cakes", href: "/category/cakes?weight=2" },
                      { name: "Birthday Specials", href: "/category/birthday-cakes" },
                      { name: "Birthday Cakes for Kids 🎈", href: "/category/birthday-cakes?recipient=kids" },
                      { name: "Birthday Cakes for Him 👨", href: "/category/birthday-cakes?recipient=him" },
                      { name: "Birthday Cakes for Her 👩", href: "/category/birthday-cakes?recipient=her" },
                      { name: "Milestone Birthday Specials", href: "/category/birthday-cakes?recipient=milestone" },
                      { name: "Wedding Masterpieces", href: "/category/wedding-cakes" },
                      { name: "Elegant Floral Weddings 🌸", href: "/category/wedding-cakes?style=floral" },
                      { name: "Elegant Naked Cakes", href: "/category/wedding-cakes?style=naked" },
                      { name: "Anniversary Collection", href: "/category/anniversary-cakes" },
                      { name: "25th Silver Jubilee 🥈", href: "/category/anniversary-cakes?milestone=25th" },
                      { name: "50th Golden Jubilee 🥇", href: "/category/anniversary-cakes?milestone=50th" },
                      { name: "Heart-Shaped Anniversary Cakes", href: "/category/anniversary-cakes?theme=heart" }
                    ]}
                    onLinkClick={() => setAllDrawerOpen(false)}
                  />

                  {/* Category Node 2: Rich Chocolate Cakes */}
                  <CategoryTreeNode 
                    title="🍫 Rich Chocolate Decadence" 
                    isOpenDefault={true}
                    links={[
                      { name: "All Chocolate Cakes", href: "/category/chocolate-cakes" },
                      { name: "Belgian Truffle Cake 🍫", href: "/category/chocolate-cakes?type=truffle" },
                      { name: "Dark Ganache Decadence", href: "/category/chocolate-cakes?type=dark" },
                      { name: "Chocolate Mud Overload", href: "/category/chocolate-cakes?type=mud" },
                      { name: "Death By Chocolate 💀", href: "/category/chocolate-cakes?type=death" },
                      { name: "Nutella Hazelnut Premium", href: "/category/chocolate-cakes?type=nutella" },
                      { name: "Ferrero Rocher Delight", href: "/category/chocolate-cakes?type=ferrero" },
                      { name: "Oreo Chocolate Smash", href: "/category/chocolate-cakes?type=oreo" }
                    ]}
                    onLinkClick={() => setAllDrawerOpen(false)}
                  />

                  {/* Category Node 3: Custom & Speciality Designs */}
                  <CategoryTreeNode 
                    title="✨ Custom Designer Artistry" 
                    isOpenDefault={false}
                    links={[
                      { name: "Theme & Custom Designer Cakes", href: "/category/designer-cakes" },
                      { name: "Hand-Painted Cakes 🎨", href: "/category/designer-cakes?type=painted" },
                      { name: "Abstract Buttercream Designs", href: "/category/designer-cakes?type=abstract" },
                      { name: "Textured Marble Finishes", href: "/category/designer-cakes?type=marble" },
                      { name: "Isomalt Glass Tiaras 👑", href: "/category/designer-cakes?type=tiara" },
                      { name: "Edible Gold Leaf Accented", href: "/category/designer-cakes?type=gold" },
                      { name: "Korean Bento Minis", href: "/category/bento-cakes" },
                      { name: "Photo Printed Creations", href: "/category/photo-cakes" }
                    ]}
                    onLinkClick={() => setAllDrawerOpen(false)}
                  />

                  {/* Category Node 4: Healthy & Eggless Options */}
                  <CategoryTreeNode 
                    title="🌿 Healthy & Eggless Delights" 
                    isOpenDefault={false}
                    links={[
                      { name: "All Eggless Cakes", href: "/category/eggless-cakes" },
                      { name: "Sugar-Free Eggless Truffle", href: "/category/eggless-cakes?type=sugar-free" },
                      { name: "Gluten-Free Eggless Cake", href: "/category/eggless-cakes?type=gluten-free" },
                      { name: "Pure Vegan Chocolate 🥑", href: "/category/eggless-cakes?type=vegan" }
                    ]}
                    onLinkClick={() => setAllDrawerOpen(false)}
                  />

                  {/* Category Node 5: Individual Treats & Pastries */}
                  <CategoryTreeNode 
                    title="🧁 Individual Treats & Pastries" 
                    isOpenDefault={false}
                    links={[
                      { name: "All Cupcakes", href: "/category/cupcakes" },
                      { name: "Red Velvet Rosette 🧁", href: "/category/cupcakes?flavor=red-velvet" },
                      { name: "Double Chocolate Fudge", href: "/category/cupcakes?flavor=chocolate" },
                      { name: "Classic Madagascar Bean", href: "/category/cupcakes?flavor=vanilla" },
                      { name: "Salted Caramel Drizzle", href: "/category/cupcakes?flavor=caramel" },
                      { name: "French Pastries Slices", href: "/category/pastries" }
                    ]}
                    onLinkClick={() => setAllDrawerOpen(false)}
                  />

                  {/* Category Node 6: Boutique Gifting */}
                  <CategoryTreeNode 
                    title="🎁 Bespoke Gifting & Combos" 
                    isOpenDefault={false}
                    links={[
                      { name: "All Gift Combos", href: "/category/combos" },
                      { name: "Flowers & Cake Combos", href: "/category/all?addon=flowers" },
                      { name: "Premium Party Props", href: "/category/all?addon=props" }
                    ]}
                    onLinkClick={() => setAllDrawerOpen(false)}
                  />

                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 bg-cream/30 dark:bg-[#0c1a30] border-t border-border-color shrink-0 text-[11px] text-navy/60 dark:text-white/60 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-navy dark:text-white">
                <Phone className="w-3.5 h-3.5 text-orange" /> Boutique Help: +91 98765 43210
              </p>
              <p>&copy; 2026 Amore Cakes Bakery. All rights reserved.</p>
            </div>
          </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
