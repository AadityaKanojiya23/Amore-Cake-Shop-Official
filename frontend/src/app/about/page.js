'use client';
import React from 'react';
import { Award, Users, Heart, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function AboutStoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-background text-foreground animate-fade-in">
      
      {/* 1. JUMBOTRON HEADER */}
      <div className="bg-cream border border-border-color p-8 md:p-14 rounded-[32px] text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange/5 rounded-full blur-3xl"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-orange bg-orange/10 px-3.5 py-1.5 rounded-full border border-orange/20">Our Legacy</span>
        <h1 className="text-3xl md:text-5.5xl font-serif font-black text-navy leading-none">The Amore Cakes Chronicle</h1>
        <p className="text-navy/70 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed font-semibold">Handcrafting breathtaking cake architectures and designer cupcakes using organic ingredients since 2018.</p>
      </div>

      {/* 2. OUR OUR STORIES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-navy">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl md:text-3.5xl font-serif font-black tracking-tight leading-tight">We Bake with Passion</h2>
          <p className="text-xs md:text-sm text-navy/85 leading-relaxed font-semibold">
            At Amore Cakes, we believe that celebrations are too sacred for standard off-the-shelf confectioneries. That is why our central boutique baking complex houses a dedicated team of certified pastry experts, custom-design artists, and master chocolatier executives.
          </p>
          <p className="text-xs md:text-sm text-navy/85 leading-relaxed font-semibold">
            We source our milk chocolates strictly from single-origin organic cooperatives in Belgium, use wild Madagascar vanilla bean extractions, and bake 100% eggless recipes in pristine clean vegetarian ovens.
          </p>
          <div className="pt-2">
            <Link href="/category/all" className="bg-orange hover:bg-orange-hover text-white font-black py-3 px-6 rounded-full text-xs shadow-md transition-all uppercase hover:scale-102">
              Explore Our Creations
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6">
          <img 
            src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600" 
            alt="chef baking gourmet delicacies" 
            className="w-full h-80 object-cover rounded-[32px] border border-border-color shadow-md"
          />
        </div>
      </div>

      {/* 3. TRUST FEATURES GRIDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-navy font-black">
        <div className="bg-card-bg border border-border-color p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="bg-cream text-orange p-3 rounded-2xl w-12 h-12 flex items-center justify-center"><Award className="w-6 h-6" /></div>
          <h3 className="font-serif font-black text-sm">Award-Winning Chefs</h3>
          <p className="text-navy/60 text-xs font-semibold leading-relaxed">Baked under direct supervision of international culinary degree champions.</p>
        </div>
        <div className="bg-card-bg border border-border-color p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="bg-cream text-orange p-3 rounded-2xl w-12 h-12 flex items-center justify-center"><Users className="w-6 h-6" /></div>
          <h3 className="font-serif font-black text-sm">10k+ Happy Families</h3>
          <p className="text-navy/60 text-xs font-semibold leading-relaxed">Promised same-day smiles across birthdays, baby showers, and Elite weddings.</p>
        </div>
        <div className="bg-card-bg border border-border-color p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="bg-cream text-orange p-3 rounded-2xl w-12 h-12 flex items-center justify-center"><Heart className="w-6 h-6" /></div>
          <h3 className="font-serif font-black text-sm">100% Pure Vegetarian</h3>
          <p className="text-navy/60 text-xs font-semibold leading-relaxed">Specialized eggless alternatives crafted using natural fruit pectins.</p>
        </div>
        <div className="bg-card-bg border border-border-color p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="bg-cream text-orange p-3 rounded-2xl w-12 h-12 flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
          <h3 className="font-serif font-black text-sm">Premium Safety Sealed</h3>
          <p className="text-navy/60 text-xs font-semibold leading-relaxed">Insulated deliveries ensuring cakes remain cold, firm, and hygienic.</p>
        </div>
      </div>

      {/* 4. CONTACT INFODESK */}
      <section className="bg-navy-dark text-white p-8 md:p-12 rounded-[32px] shadow-xl relative overflow-hidden border-y border-orange">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <h2 className="text-2xl md:text-3.5xl font-serif font-black tracking-tight leading-tight text-white animate-pulse">Need Customized Cake Advice?</h2>
          <p className="text-white/70 text-xs md:text-sm max-w-md mx-auto leading-relaxed font-semibold">Speak directly with our Head Pastry Chef to craft bespoke multi-tier cakes for grand occasions!</p>
          <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs font-black text-white">
            <span className="flex items-center gap-2 bg-white/5 border border-white/5 py-2 px-4 rounded-full"><Phone className="w-4 h-4 text-orange" /> Call support: +91 98765 43210</span>
            <span className="flex items-center gap-2 bg-white/5 border border-white/5 py-2 px-4 rounded-full"><Mail className="w-4 h-4 text-orange" /> Email desk: orders@amorecakes.com</span>
            <span className="flex items-center gap-2 bg-white/5 border border-white/5 py-2 px-4 rounded-full"><MapPin className="w-4 h-4 text-orange" /> Central Complex: Worli, Mumbai</span>
          </div>
        </div>
      </section>

    </div>
  );
}
