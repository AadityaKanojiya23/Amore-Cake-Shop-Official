'use client';
import React, { use, useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Star, Heart, ShoppingBag, Eye, Clock, ShieldCheck, 
  ChevronLeft, ChevronRight, MessageSquare, Plus, Minus,
  Trash, Calendar, Info, Users, UtensilsCrossed
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  const { 
    products, addToCart, toggleWishlist, wishlist, isBackendOnline, showToast
  } = useApp();

  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customize states
  const [activeImage, setActiveImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('0.5kg');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [isEggless, setIsEggless] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Add-ons
  const [addCandles, setAddCandles] = useState(false);
  const [addFlowers, setAddFlowers] = useState(false);
  const [addChocolates, setAddChocolates] = useState(false);

  // Delivery slot details
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Standard (12 PM - 6 PM)');
  const [deliveryType, setDeliveryType] = useState('Standard');

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  useEffect(() => {
    if (products.length === 0) return;
    setLoading(true);

    const foundProduct = products.find(p => p.slug === slug);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.images[0]);
      setSelectedWeight(foundProduct.weights ? foundProduct.weights[0] : '0.5kg');
      setSelectedFlavor(foundProduct.flavors ? foundProduct.flavors[0] : 'Default');
      
      // Filter similar products
      const filteredSimilar = products
        .filter(p => p.category === foundProduct.category && p._id !== foundProduct._id)
        .slice(0, 4);
      setSimilar(filteredSimilar);

      // Generate mock reviews for this product
      setReviews([
        { _id: 'r1', userName: 'Aarav Mehta', rating: 5, comment: 'Brought this for my sister\'s birthday, the decoration was flawless and flavor was exceptionally premium.', createdAt: '2026-05-02' },
        { _id: 'r2', userName: 'Sneha Rao', rating: 4, comment: 'Incredibly soft texture, eggless option is great and did not taste dry at all. Shipping was super smooth!', createdAt: '2026-05-05' }
      ]);
    }
    setLoading(false);
  }, [slug, products]);

  // Handle Form actions
  const handleAddToCart = (redirect = false) => {
    if (!product) return;
    
    // Delivery check
    if (!deliveryDate) {
      showToast('Please select a preferred delivery date before checkout.', 'warning');
      return;
    }

    addToCart(
      product,
      quantity,
      selectedWeight,
      selectedFlavor,
      isEggless,
      customMessage,
      addCandles,
      addFlowers,
      addChocolates
    );

    if (redirect) {
      router.push('/cart');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    const newReview = {
      _id: `r_new_${Math.random()}`,
      userName: 'You (Shopper)',
      rating: userRating,
      comment: userComment,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setReviews([newReview, ...reviews]);
    setUserComment('');
    showToast('Review submitted successfully for moderation!', 'success');
  };

  if (loading || !product) {
    return (
      <div className="flex-grow flex items-center justify-center py-24 bg-background text-navy gap-3">
        <div className="w-12 h-12 border-t-2 border-b-2 border-orange rounded-full animate-spin"></div>
        <span className="font-sans font-black animate-pulse uppercase tracking-wider text-xs">Cooking Details...</span>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product._id);
  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-background text-foreground">
      
      {/* Dynamic breadcrumb */}
      <div className="text-xs text-navy/50 font-black uppercase tracking-wider flex items-center gap-2">
        <Link href="/" className="hover:text-orange">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="hover:text-orange">{product.category.replace('-', ' ')}</Link>
        <span>/</span>
        <span className="text-navy/80">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Display Image with Hover Zoom */}
          <div className="rounded-[32px] overflow-hidden aspect-square border border-border-color bg-card-bg zoom-container shadow-md">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover zoom-image"
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`rounded-2xl overflow-hidden aspect-square border-2 bg-card-bg transition-all ${activeImage === img ? 'border-orange shadow-sm scale-95' : 'border-border-color hover:border-orange'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details & Customizations Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-border-color pb-4">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl md:text-3.5xl font-serif font-black text-navy leading-tight">{product.name}</h1>
              <button 
                onClick={() => toggleWishlist(product._id)}
                className="p-2 border border-border-color hover:bg-cream rounded-full text-navy shrink-0 transition-colors shadow-sm"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-navy/60'}`} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-navy">
              <div className="flex text-gold">
                <Star className="w-4 h-4 fill-gold text-gold" />
              </div>
              <span>{product.rating} / 5.0 Rating</span>
              <span className="text-navy/40">|</span>
              <span className="text-navy/60">{product.reviewsCount} verified reviews</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-orange font-black text-3xl">₹{product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <>
                  <span className="text-navy/40 line-through text-sm font-bold">₹{product.price}</span>
                  <span className="text-success bg-success/10 border border-success/20 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Save {discountPercent}%</span>
                </>
              )}
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-2 text-xs md:text-sm text-navy/80 leading-relaxed font-semibold">
            <p>{product.description}</p>
            <p className="text-navy/50 text-xs">{product.longDescription}</p>
          </div>

          {/* Customization Details: Weights */}
          {product.weights && product.weights.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1">
                <UtensilsCrossed className="w-4 h-4 text-orange" /> Select Cake Weight
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {product.weights.map(w => (
                  <button 
                    key={w} 
                    onClick={() => setSelectedWeight(w)}
                    className={`text-xs font-black px-4 py-2 rounded-xl border transition-all ${selectedWeight === w ? 'bg-orange text-white border-orange shadow-md' : 'border-border-color hover:border-orange bg-background text-navy'}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization Details: Flavors */}
          {product.flavors && product.flavors.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Select Flavor Filling</h3>
              <div className="flex flex-wrap gap-2.5">
                {product.flavors.map(f => (
                  <button 
                    key={f} 
                    onClick={() => setSelectedFlavor(f)}
                    className={`text-xs font-black px-4 py-2 rounded-xl border transition-all ${selectedFlavor === f ? 'bg-orange text-white border-orange shadow-md' : 'border-border-color hover:border-orange bg-background text-navy'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom message field */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex justify-between">
              <span>Message Written on Cake</span>
              <span className="text-[10px] text-navy/50 font-sans font-black">Max 25 Characters</span>
            </h3>
            <input 
              type="text" 
              maxLength={25}
              placeholder="E.g. Happy Anniversary Mom & Dad" 
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full text-xs font-semibold border border-border-color p-3 rounded-xl outline-none focus:ring-1 focus:ring-orange bg-background text-navy"
            />
          </div>

          {/* Pure Veg / Eggless toggle */}
          {product.isEgglessOption && (
            <label className="flex items-center gap-2.5 text-xs font-black text-navy cursor-pointer select-none bg-cream p-3 rounded-xl border border-border-color">
              <input 
                type="checkbox" 
                checked={isEggless} 
                onChange={(e) => setIsEggless(e.target.checked)}
                className="accent-orange rounded w-4 h-4"
              />
              <span>100% Pure Vegetarian Eggless Recipe (+ ₹50 weight charge applied)</span>
            </label>
          )}

          {/* DELIVERABLE DATE AND TIME PICKER */}
          <div className="bg-cream border border-border-color rounded-2xl p-4 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange" /> Scheduled Delivery Slot Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-navy/60">Preferred Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full text-xs font-black p-2.5 bg-card-bg border border-border-color rounded-xl outline-none focus:ring-1 focus:ring-orange text-navy cursor-pointer"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-navy/60">Delivery Hour Bracket</label>
                <select 
                  value={deliverySlot}
                  onChange={(e) => {
                    setDeliverySlot(e.target.value);
                    const isMidnight = e.target.value.includes('Midnight');
                    const isExpress = e.target.value.includes('Express');
                    setDeliveryType(isMidnight ? 'Midnight' : isExpress ? 'Express' : 'Standard');
                  }}
                  className="w-full text-xs font-black p-2.5 bg-card-bg border border-border-color rounded-xl outline-none focus:ring-1 focus:ring-orange text-navy cursor-pointer"
                >
                  <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM) [+ ₹50]</option>
                  <option value="Standard (12 PM - 6 PM)">Standard (12 PM - 6 PM) [Free]</option>
                  <option value="Express (6 PM - 9 PM)">Express (6 PM - 9 PM) [+ ₹100]</option>
                  <option value="Midnight (11 PM - 12 AM)">Midnight (11 PM - 12 AM) [+ ₹150 Premium]</option>
                </select>
              </div>
            </div>
          </div>

          {/* OPTIONAL EXCLUSIVE PARTY ADD-ONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Premium Party Accessories / Add-ons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 border border-border-color hover:border-orange rounded-xl p-3 cursor-pointer select-none text-xs font-black text-navy bg-card-bg shadow-sm transition-all">
                <input type="checkbox" checked={addCandles} onChange={(e) => setAddCandles(e.target.checked)} className="accent-orange w-4 h-4" />
                <span>Metallic Candles (+₹50)</span>
              </label>
              <label className="flex items-center gap-2 border border-border-color hover:border-orange rounded-xl p-3 cursor-pointer select-none text-xs font-black text-navy bg-card-bg shadow-sm transition-all">
                <input type="checkbox" checked={addFlowers} onChange={(e) => setAddFlowers(e.target.checked)} className="accent-orange w-4 h-4" />
                <span>Rose Bouquet (+₹299)</span>
              </label>
              <label className="flex items-center gap-2 border border-border-color hover:border-orange rounded-xl p-3 cursor-pointer select-none text-xs font-black text-navy bg-card-bg shadow-sm transition-all">
                <input type="checkbox" checked={addChocolates} onChange={(e) => setAddChocolates(e.target.checked)} className="accent-orange w-4 h-4" />
                <span>Chocolates Box (+₹150)</span>
              </label>
            </div>
          </div>

          {/* QUANTITY PICKER & ACTION PANEL */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-border-color">
            <div className="flex items-center justify-between border border-border-color rounded-2xl py-2 px-4 bg-cream">
              <span className="text-xs font-black text-navy mr-4">Qty:</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-1 hover:bg-background rounded text-navy transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-black text-navy w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-1 hover:bg-background rounded text-navy transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button 
              onClick={() => handleAddToCart(false)}
              className="flex-1 bg-orange hover:bg-orange-hover text-white font-black py-3.5 px-6 rounded-2xl text-xs transition-all flex justify-center items-center gap-2 shadow-md hover:scale-102"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Shopping Basket
            </button>
            <button 
              onClick={() => handleAddToCart(true)}
              className="flex-1 bg-navy hover:bg-navy-dark text-white font-black py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md text-center hover:scale-102"
            >
              Express Checkout Now
            </button>
          </div>

          {/* Product Specifications Table */}
          {product.ingredients && (
            <div className="border border-border-color rounded-2xl p-4 bg-cream space-y-2 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/50 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-orange" /> Ingredients & Safety Specs
              </h4>
              <p className="text-xs text-navy/70 font-semibold leading-relaxed">
                Contains: {product.ingredients.join(', ')}. Freshly baked to order. Consumable within 48 hours if refrigerated.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* VERIFIED CUSTOMER REVIEWS FEEDBACK BLOCKS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-border-color pt-12">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-2xl font-serif font-black text-navy flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange" /> Product Review Logs
          </h2>
          <p className="text-xs md:text-sm text-navy/60 leading-relaxed font-semibold">
            Read authentic reviews left by other verification-badged Amore Cakes shoppers. Or submit your own gourmet feedback rating.
          </p>
          
          {/* Review Submission Form */}
          <form onSubmit={handleReviewSubmit} className="bg-cream border border-border-color p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="font-serif font-black text-navy text-base">Write a Review</h3>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-navy/50">Star Rating</label>
              <div className="flex gap-1.5 text-gold">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button 
                    key={num} 
                    type="button" 
                    onClick={() => setUserRating(num)}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${num <= userRating ? 'fill-gold text-gold' : 'text-navy/20'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-navy/50">Your Commentary</label>
              <textarea 
                rows={3}
                placeholder="How was the texture, cream fresh-piping, and delivery timing?"
                required
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-border-color bg-card-bg text-navy rounded-2xl outline-none focus:ring-1 focus:ring-orange"
              />
            </div>

            <button type="submit" className="bg-orange hover:bg-orange-hover text-white font-black py-2.5 px-6 rounded-full text-xs transition-colors shadow-sm">
              Publish Review
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="lg:col-span-7 space-y-4 max-h-[420px] overflow-y-auto no-scrollbar pr-2">
          {reviews.length === 0 ? (
            <p className="text-xs text-navy/40 italic font-black">No reviews logged yet. Be the first to verify order!</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="bg-card-bg border border-border-color p-5 rounded-2xl space-y-2.5 shadow-sm hover:border-orange transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <h4 className="font-serif font-black text-navy">{r.userName}</h4>
                  <span className="text-navy/40 font-black">{r.createdAt}</span>
                </div>
                <div className="flex text-gold">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-navy/85 text-xs md:text-sm font-semibold leading-relaxed">&quot;{r.comment}&quot;</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SIMILAR RELATED RECOMMENDATIONS BAR */}
      {similar.length > 0 && (
        <section className="border-t border-border-color pt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-black text-navy">You Might Also Crave</h2>
            <p className="text-xs text-navy/50 font-black uppercase tracking-wider">Similar premium recipes in this segment</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((prod) => (
              <div key={prod._id} className="bg-card-bg border border-border-color rounded-3xl p-4 flex flex-col justify-between group hover:border-orange amore-card shadow-sm transition-all relative">
                <Link href={`/product/${prod.slug}`} className="cursor-pointer space-y-3 block">
                  <div className="rounded-xl overflow-hidden aspect-video border border-border-color">
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                  </div>
                  <h3 className="font-serif font-black text-navy text-sm truncate leading-tight group-hover:text-orange transition-colors">{prod.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-orange font-black text-sm">₹{prod.discountPrice || prod.price}</span>
                    <span className="text-[10px] bg-orange/15 text-orange font-black px-1.5 py-0.5 rounded uppercase border border-orange/20">Verify</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
