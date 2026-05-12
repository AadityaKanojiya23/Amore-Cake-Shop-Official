'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Heart, ShoppingBag, Eye, Star, ChevronLeft, ChevronRight, 
  Clock, Award, Flame, Quote, Send, ArrowRight, ShieldCheck, HelpCircle, X,
  Play, Pause, Volume2, VolumeX, Smartphone, Tv, CheckCircle, Lightbulb, Code
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Special Moments & Shorts Data (Amore Cakes)
const shortVideos = [
  {
    id: 'wedding-cake',
    title: 'Dream Wedding Cake',
    desc: 'A beautiful moment from Riya & Arjun\'s big day!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-confectioner-decorating-a-wedding-cake-with-flowers-40847-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600',
    duration: '0:30',
    isFeatured: true,
    likes: 342,
    views: '4.8k'
  },
  {
    id: 'cake-decorating',
    title: 'Cake Decoration',
    desc: 'Behind the scenes of our floral cake magic',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-putting-frosting-on-a-cake-40846-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600',
    duration: '0:25',
    isFeatured: false,
    likes: 189,
    views: '2.5k'
  },
  {
    id: 'chocolate-showcase',
    title: 'Chocolate Bliss',
    desc: 'One of our bestsellers - pure chocolate indulgence!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-melted-chocolate-on-a-cake-40852-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
    duration: '0:28',
    isFeatured: false,
    likes: 275,
    views: '3.1k'
  },
  {
    id: 'baker-working',
    title: 'Baker\'s Magic',
    desc: 'Handmade with love by our expert baker',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-a-chocolate-cake-with-fruits-40849-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1605697040000-a01bd9ca2884?auto=format&fit=crop&q=80&w=600',
    duration: '0:22',
    isFeatured: false,
    likes: 154,
    views: '1.9k'
  },
  {
    id: 'birthday-candles',
    title: 'Customer Celebration',
    desc: 'Happy smiles, happy memories!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-blowing-out-birthday-candles-on-a-cake-40851-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1533782654613-826a072dd6f3?auto=format&fit=crop&q=80&w=600',
    duration: '0:20',
    isFeatured: false,
    likes: 421,
    views: '5.2k'
  },
  {
    id: 'rose-piping',
    title: 'Rose Piping Art',
    desc: 'Delicate buttercream piping process.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-putting-frosting-on-a-cake-40846-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=600',
    duration: '0:18',
    isFeatured: false,
    likes: 132,
    views: '1.4k'
  },
  {
    id: 'gold-leaf',
    title: 'Gold Leaf Touch',
    desc: 'Placing edible 24k gold flakes.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-confectioner-decorating-a-wedding-cake-with-flowers-40847-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    duration: '0:15',
    isFeatured: false,
    likes: 98,
    views: '890'
  },
  {
    id: 'meringue-whisk',
    title: 'Cream Whisking',
    desc: 'Whipped cream beating to stiff peaks.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-putting-frosting-on-a-cake-40846-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
    duration: '0:25',
    isFeatured: false,
    likes: 215,
    views: '2.1k'
  },
  {
    id: 'icing-drizzle',
    title: 'Glaze Drizzling',
    desc: 'Pouring hot white chocolate syrup.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-melted-chocolate-on-a-cake-40852-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600',
    duration: '0:19',
    isFeatured: false,
    likes: 310,
    views: '3.6k'
  },
  {
    id: 'dough-craft',
    title: 'Baker\'s Dough',
    desc: 'Kneading artisanal yeast puff dough.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-a-chocolate-cake-with-fruits-40849-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    duration: '0:21',
    isFeatured: false,
    likes: 112,
    views: '1.2k'
  },
  {
    id: 'cupcake-swirl',
    title: 'Cupcake Swirls',
    desc: 'Perfect raspberry swirls piped live.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-putting-frosting-on-a-cake-40846-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600',
    duration: '0:14',
    isFeatured: false,
    likes: 180,
    views: '1.9k'
  },
  {
    id: 'velvet-slice',
    title: 'Slicing Red Velvet',
    desc: 'Extremely satisfying clean vertical cut.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-blowing-out-birthday-candles-on-a-cake-40851-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=600',
    duration: '0:22',
    isFeatured: false,
    likes: 290,
    views: '3.4k'
  },
  {
    id: 'raspberry-fruit',
    title: 'Organic Raspberries',
    desc: 'Garnishing fruit tart overlays.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-a-chocolate-cake-with-fruits-40849-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=600',
    duration: '0:27',
    isFeatured: false,
    likes: 145,
    views: '1.6k'
  },
  {
    id: 'lemon-torch',
    title: 'Browning Meringue',
    desc: 'Bespoke hand-torching sweet tarts.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-putting-frosting-on-a-cake-40846-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=600',
    duration: '0:17',
    isFeatured: false,
    likes: 204,
    views: '2.2k'
  },
  {
    id: 'gold-box',
    title: 'Premium Ribbons',
    desc: 'Amore boutique ribboning process.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-confectioner-decorating-a-wedding-cake-with-flowers-40847-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=600',
    duration: '0:24',
    isFeatured: false,
    likes: 159,
    views: '1.8k'
  },
  {
    id: 'sugar-dust',
    title: 'Sugar Snowfall',
    desc: 'Powdering sugar dust in ultra slow-motion.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-melted-chocolate-on-a-cake-40852-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    duration: '0:16',
    isFeatured: false,
    likes: 275,
    views: '3.0k'
  },
  {
    id: 'cream-filling',
    title: 'Custard Injection',
    desc: 'Piping premium vanilla bean custard.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-putting-frosting-on-a-cake-40846-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600',
    duration: '0:20',
    isFeatured: false,
    likes: 121,
    views: '1.3k'
  },
  {
    id: 'cheesecake-caramel',
    title: 'Caramel Swirls',
    desc: 'Pouring hot organic caramel on cream.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-melted-chocolate-on-a-cake-40852-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600',
    duration: '0:23',
    isFeatured: false,
    likes: 318,
    views: '3.5k'
  },
  {
    id: 'croissant-bake',
    title: 'Oven Rise',
    desc: 'Puff croissants rising in our live kitchen.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-blowing-out-birthday-candles-on-a-cake-40851-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    duration: '0:28',
    isFeatured: false,
    likes: 194,
    views: '2.0k'
  },
  {
    id: 'molten-lava',
    title: 'Molten Fudge Cut',
    desc: 'Hot chocolate fudge erupting in slow-mo.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-melted-chocolate-on-a-cake-40852-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    duration: '0:15',
    isFeatured: false,
    likes: 490,
    views: '5.9k'
  },
  {
    id: 'sweet-table',
    title: 'Sweet Bar Buffet',
    desc: 'Grooming custom desserts tables.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-confectioner-decorating-a-wedding-cake-with-flowers-40847-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600',
    duration: '0:29',
    isFeatured: false,
    likes: 167,
    views: '1.9k'
  }
];

export default function HomePage() {
  const { 
    products, categories, addToCart, toggleWishlist, wishlist, loading, showToast 
  } = useApp();

  const router = useRouter();

  // Carousel & Modal states
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Customization states for Quick View
  const [selectedWeight, setSelectedWeight] = useState('0.5kg');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [isEggless, setIsEggless] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  // Testimonial Coordinates
  const [tiltStyle, setTiltStyle] = useState({});

  // Special Moments & Shorts States
  const shortsScrollRef = React.useRef(null);
  const [mobileShortIndex, setMobileShortIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const handleOpenVideoPlayer = (item) => {
    setActiveVideo(item);
    setVideoLoadError(false);
  };
  const [activeDot, setActiveDot] = useState(0);
  const [showAllShortsModal, setShowAllShortsModal] = useState(false);
  const [likesCount, setLikesCount] = useState({
    'wedding-cake': 342,
    'cake-decorating': 189,
    'chocolate-showcase': 275,
    'baker-working': 154,
    'birthday-candles': 421
  });
  const [isLiked, setIsLiked] = useState({
    'wedding-cake': false,
    'cake-decorating': false,
    'chocolate-showcase': false,
    'baker-working': false,
    'birthday-candles': false
  });
  const [heartAnimations, setHeartAnimations] = useState([]);
  const [videoProgress, setVideoProgress] = useState(0);
  const [newCommentText, setNewCommentText] = useState('');
  const [comments, setComments] = useState({
    'wedding-cake': [
      { name: 'Chef Aditya', text: 'Bespoke 3-tier masterpiece with Madagascar vanilla! 👑', isChef: true },
      { name: 'Riya Sharma', text: 'Literally the highlight of our big day! Breathtaking layers. 😍', isChef: false },
      { name: 'Nikhil K.', text: 'Is this eggless? It looks so fluffy!', isChef: false }
    ],
    'cake-decorating': [
      { name: 'Chef Aditya', text: 'Hand-piping our signature organic rosewater buttercream. 🌹', isChef: true },
      { name: 'Ananya G.', text: 'The flower details are unbelievable! True art.', isChef: false }
    ],
    'chocolate-showcase': [
      { name: 'Chef Aditya', text: '72% single-origin Belgian dark chocolate ganache! 🍫', isChef: true },
      { name: 'Siddharth M.', text: 'This drip is incredibly satisfying to watch...', isChef: false }
    ],
    'baker-working': [
      { name: 'Chef Aditya', text: 'Where the baking magic happens daily under perfect sanitation.', isChef: true },
      { name: 'Preeti S.', text: 'Cleanliness and baking excellence combined!', isChef: false }
    ],
    'birthday-candles': [
      { name: 'Chef Aditya', text: 'Happy birthdays make our midnight baking shifts 100% worth it!', isChef: true },
      { name: 'Rohit D.', text: 'Their midnight delivery is always right on time at 11:59 PM!', isChef: false }
    ]
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeVideo) return;
    
    const videoId = activeVideo.id;
    const commentObj = {
      name: 'Aditya (You)',
      text: newCommentText.trim(),
      isChef: false
    };
    
    setComments(prev => ({
      ...prev,
      [videoId]: [...(prev[videoId] || []), commentObj]
    }));
    setNewCommentText('');
    showToast("Comment published! Thank you for sharing 💖", "success");
  };

  const handleLikeShort = (id, event) => {
    event?.stopPropagation();
    const wasLiked = !!isLiked[id];
    setIsLiked(prev => ({ ...prev, [id]: !wasLiked }));
    setLikesCount(prev => ({
      ...prev,
      [id]: wasLiked ? Math.max(0, (prev[id] || 0) - 1) : (prev[id] || 0) + 1
    }));

    if (!wasLiked && event) {
      // Trigger a burst of floating hearts if it's a new like
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const animationId = Date.now() + Math.random();
      
      setHeartAnimations(prev => [...prev, { id: animationId, x, y }]);
      setTimeout(() => {
        setHeartAnimations(prev => prev.filter(h => h.id !== animationId));
      }, 800);
    }
  };

  const handleDoubleTapLike = (id, event) => {
    if (!isLiked[id]) {
      handleLikeShort(id, event);
    } else {
      // Trigger floating heart anyway for a fun interactive feel
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.width / 2 + (Math.random() * 60 - 30);
      const y = rect.height / 2 + (Math.random() * 60 - 30);
      const animationId = Date.now() + Math.random();
      
      setHeartAnimations(prev => [...prev, { id: animationId, x, y }]);
      setTimeout(() => {
        setHeartAnimations(prev => prev.filter(h => h.id !== animationId));
      }, 800);
    }
  };

  const getAssociatedProduct = (video) => {
    if (!products || products.length === 0) return null;
    if (video.id === 'wedding-cake') {
      return products.find(p => p.category === 'wedding-cakes') || products[0];
    } else if (video.id === 'chocolate-showcase') {
      return products.find(p => p.category === 'chocolate-cakes') || products[0];
    } else if (video.id === 'cake-decorating') {
      return products.find(p => p.isTrending) || products[0];
    } else if (video.id === 'baker-working') {
      return products.find(p => p.isBestSeller) || products[0];
    } else {
      return products.find(p => p.category === 'cupcakes') || products[0];
    }
  };

  // Hero Slider Data (Amore Cakes Branding)
  const heroBanners = [
    {
      title: 'Spectacular Birthday Celebrations',
      subtitle: 'Save 20% on Designer Custom Masterpieces',
      badge: 'Trending Designs',
      image: 'https://images.unsplash.com/photo-1533782654613-826a072dd6f3?auto=format&fit=crop&q=80&w=1200',
      tagline: 'Hand-piped luxury buttercream, customizable layers, eggless options.',
      buttonText: 'Order Birthday Cakes',
      link: '/category/birthday-cakes'
    },
    {
      title: 'Royal Wedding Masterpieces',
      subtitle: 'Chef Recommended 3-Tier Festive Celebrations',
      badge: 'Bespoke Luxury',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=1200',
      tagline: 'Crafted with premium Belgian white chocolate and wild Madagascar vanilla bean cream.',
      buttonText: 'View Wedding Collection',
      link: '/category/wedding-cakes'
    },
    {
      title: 'Midnight Surprise Delivered Fresh',
      subtitle: 'Baked Fresh & Delivered to Your Door at 11:59 PM',
      badge: 'Premium Express',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200',
      tagline: 'Midnight delivery guarantees your surprise feels exactly like premium magic.',
      buttonText: 'Explore Midnight Cakes',
      link: '/category/chocolate-cakes'
    }
  ];

  // Rectangular Offer Banners
  const promoBanners = [
    { id: 1, title: 'Buy 1 Get 1 Cupcake Special', desc: 'Add 2 cupcakes to your bag, get one free.', bg: 'from-orange/90 to-gold', tag: 'Limited Offer', link: '/category/cupcakes' },
    { id: 2, title: 'Midnight Delivery Premium', desc: 'Guaranteed surprise drop at 11:59 PM.', bg: 'from-navy-dark to-navy', tag: 'Highly Rated', link: '/category/premium-cakes' },
    { id: 3, title: 'Eggless Pastry Summer Drop', desc: 'Refreshing Mango & Strawberry layers.', bg: 'from-orange/80 to-orange-hover', tag: 'New Arrivals', link: '/category/pastries' },
    { id: 4, title: 'Premium Festive Combo Boxes', desc: 'Candles, gold cards, balloons, & fresh flowers.', bg: 'from-gold to-orange/70', tag: 'Festive Pack', link: '/category/combos' }
  ];

  // Testimonials list (Amore Cakes)
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Event Designer',
      text: 'The Red Velvet Wedding cake from Amore Cakes was breathtaking. It was the absolute highlight of the ceremony. Flawless decoration and deep moist layers!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Rohan Deshmukh',
      role: 'Tech Executive',
      text: 'Amore Cakes midnight delivery never fails me. The chocolate truffle cake arrived right at 11:59 PM, perfectly packaged, super fresh and still warm from the baking ovens!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Ananya Goel',
      role: 'Mother of Two',
      text: 'My kids loved the Rainbow Designer cake. It was 100% eggless, super soft, and not overly sweet. Their customer service team also adjusted the design specifically for us!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
    }
  ];

  // Pinterest Gallery data
  const galleryItems = [
    { img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=350', title: 'Belgian Chocolate Drizzle' },
    { img: 'https://images.unsplash.com/photo-1533782654613-826a072dd6f3?auto=format&fit=crop&q=80&w=350', title: 'Magical Confetti Reveal' },
    { img: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=350', title: 'Golden Wedding Frost' },
    { img: 'https://images.unsplash.com/photo-1562266648-a47af8e9e4f2?auto=format&fit=crop&q=80&w=350', title: 'Strawberry Dream Tower' },
    { img: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=350', title: 'Chef Recommended Velvet' },
    { img: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=350', title: 'Unicorn Swirl Cupcakes' }
  ];

  // FAQs
  const faqs = [
    { q: 'Is midnight delivery guaranteed at exactly 12 AM?', a: 'Yes! Our dedicated delivery partners operate specialized insulated bakery vehicles to hand-deliver your cake between 11:45 PM and 12:05 AM.' },
    { q: 'Can I request 100% eggless cakes?', a: 'Almost all our cakes can be ordered 100% eggless. We use natural organic fruit pectins and premium yogurts to achieve the same fluffy consistency.' },
    { q: 'Do you offer custom designs not on the website?', a: 'Absolutely! Click the Call Support button in our footer to speak directly with our Head Pastry Chef to craft a bespoke cake design for your theme party.' },
    { q: 'What is the 30% advance on COD orders?', a: 'Since customized birthday and anniversary cakes cannot be re-sold if cancelled, we collect a secure 30% advance online, with the remaining 70% payable upon delivery.' }
  ];

  // Auto sliding carousels
  useEffect(() => {
    if (loading) return;
    const heroTimer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroBanners.length);
    }, 6000);

    const testimonialTimer = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(heroTimer);
      clearInterval(testimonialTimer);
    };
  }, [loading]);

  // Handle Quick View Popup Activation
  const handleOpenQuickView = (prod) => {
    setQuickViewProduct(prod);
    setSelectedWeight(prod.weights ? prod.weights[0] : '0.5kg');
    setSelectedFlavor(prod.flavors ? prod.flavors[0] : 'Standard Chocolate');
    setIsEggless(true);
    setCustomMessage('');
  };

  const handleQuickViewAddToCart = () => {
    addToCart(
      quickViewProduct,
      1,
      selectedWeight,
      selectedFlavor,
      isEggless,
      customMessage
    );
    setQuickViewProduct(null);
  };

  // 3D Testimonial Tilt Event
  const handleTestimonialMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotX = (y / (box.height / 2)) * -10;
    const rotY = (x / (box.width / 2)) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`
    });
  };

  const handleTestimonialMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'all 0.5s ease'
    });
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-24 bg-background text-navy gap-4">
        <div className="w-16 h-16 border-t-4 border-b-4 border-orange rounded-full animate-spin"></div>
        <div className="text-sm font-sans font-black animate-pulse tracking-widest uppercase text-navy/80">
          Curating Spectacular Cravings...
        </div>
      </div>
    );
  }

  // Filter products for various sections
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 10);
  const trending = products.filter(p => p.isTrending).slice(0, 10);
  const premium = products.filter(p => p.isPremium).slice(0, 10);
  const chocolateHeaven = products.filter(p => p.category === 'chocolate-cakes').slice(0, 8);
  const cupcakes = products.filter(p => p.category === 'cupcakes').slice(0, 8);
  const pastries = products.filter(p => p.category === 'pastries').slice(0, 8);

  return (
    <div className="space-y-16 pb-16 bg-background">
      
      {/* 1. HERO SLIDER BANNER SECTION */}
      <section className="relative h-[440px] md:h-[580px] overflow-hidden bg-cream-light">
        {heroBanners.map((banner, index) => (
          <div 
            key={index}
            className={`absolute inset-0 flex flex-col justify-center transition-all duration-1000 ease-in-out ${index === heroIndex ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'}`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(8, 27, 75, 0.95) 25%, rgba(8, 27, 75, 0.5) 60%, rgba(8, 27, 75, 0) 100%), url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white space-y-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-gold text-navy px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> {banner.badge}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight max-w-xl leading-none">
                {banner.title}
              </h1>
              <p className="text-gold font-bold text-lg md:text-xl font-sans">{banner.subtitle}</p>
              <p className="text-white/70 max-w-md text-xs md:text-sm hidden sm:block font-medium">{banner.tagline}</p>
              <div className="pt-2">
                <Link 
                  href={banner.link} 
                  className="inline-flex items-center gap-2 bg-orange hover:bg-orange-hover text-white font-black py-3.5 px-8 rounded-full shadow-lg text-sm transition-all gold-glow"
                >
                  <span>{banner.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroBanners.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setHeroIndex(i)}
              className={`h-2.5 rounded-full transition-all ${i === heroIndex ? 'w-8 bg-orange' : 'w-2.5 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. RECTANGULAR OFFER PROMO BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoBanners.map((p) => (
            <Link 
              key={p.id} 
              href={p.link}
              className={`p-6 rounded-3xl bg-gradient-to-br ${p.bg} text-white flex flex-col justify-between h-44 hover:scale-[1.03] transition-transform duration-300 shadow-md cursor-pointer relative overflow-hidden group`}
            >
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">{p.tag}</span>
                <h3 className="text-lg font-black font-serif mt-2 leading-tight">{p.title}</h3>
              </div>
              <p className="text-white/80 text-xs font-semibold">{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. DYNAMIC PRODUCT ROW SHOWCASES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ROW 1: BEST SELLERS */}
        <ProductRow 
          title="Amore Cakes Best Sellers" 
          subtitle="Our highly-rated recipes ordered daily across India." 
          items={bestSellers} 
          onQuickView={handleOpenQuickView} 
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />

        {/* ROW 2: TRENDING & DESIGNER CAKES */}
        <ProductRow 
          title="Trending Masterpieces" 
          subtitle="Viral cake architectures sweeping celebrations this month." 
          items={trending} 
          onQuickView={handleOpenQuickView} 
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />

        {/* ROW 3: CHOCOLATE HEAVEN */}
        <ProductRow 
          title="Rich Chocolate Heaven" 
          subtitle="Belgian truffles, dark ganaches, and chocolate fudges baked by hand." 
          items={chocolateHeaven} 
          onQuickView={handleOpenQuickView} 
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />

      </section>

      {/* 4. LUXURY PREMIUM CAKES FEATURED SECTION */}
      <section className="bg-navy-dark text-background py-20 px-4 relative overflow-hidden border-y-2 border-orange/40 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1 text-gold font-bold text-xs uppercase tracking-widest">
              <Award className="w-4 h-4 text-gold" /> Chef Recommended Premium Selection
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-none text-white">
              The Luxury <br /> <span className="gold-gradient-text font-serif">Aura Collection</span>
            </h2>
            <p className="text-background/80 text-sm leading-relaxed max-w-md font-medium">
              Indulge in our super-premium 24K Gold Foil decorated cakes, curated specifically by our Head Pastry Chef. These masterpieces boast rich, single-origin dark cocoa, wild Madagascar vanilla cream, and handcrafted gold accents. Highly recommended for elite anniversaries and grand events.
            </p>
            <div className="flex gap-4 items-center pt-2">
              <div className="bg-white/5 border border-gold/30 rounded-2xl p-4 flex gap-3 items-center">
                <Clock className="w-5 h-5 text-gold" />
                <div className="text-xs">
                  <p className="font-extrabold text-white">48 Hours Notice</p>
                  <p className="text-background/60 font-medium">Required for custom details</p>
                </div>
              </div>
              <div className="bg-white/5 border border-gold/30 rounded-2xl p-4 flex gap-3 items-center">
                <Sparkles className="w-5 h-5 text-gold animate-pulse" />
                <div className="text-xs">
                  <p className="font-extrabold text-white">100% Chef Managed</p>
                  <p className="text-background/60 font-medium">Curated design handcrafting</p>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Link href="/category/premium-cakes" className="bg-orange hover:bg-orange-hover text-white font-extrabold py-3.5 px-8 rounded-full text-sm shadow-xl inline-flex items-center gap-2 gold-glow">
                <span>View Aura Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Floating Premium Cake Cards Row */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {premium.slice(0, 2).map((prod) => (
              <div 
                key={prod._id} 
                className="bg-white/5 border border-border-color/20 rounded-3xl p-6 relative group hover:border-orange transition-all gold-glow overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-orange/15 text-orange text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-orange/20">Elite Custom</div>
                <img 
                  src={prod.images[0]} 
                  alt={prod.name} 
                  className="w-full h-44 object-cover rounded-2xl transition-all duration-500 group-hover:scale-105 shadow-md border border-white/5"
                />
                <h3 className="font-serif font-black text-white text-lg mt-4 group-hover:text-gold transition-colors">{prod.name}</h3>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-orange font-extrabold text-xl">₹{prod.discountPrice || prod.price}</span>
                    <span className="text-background/40 line-through text-xs ml-1.5 font-bold">₹{prod.price}</span>
                  </div>
                  <button 
                    onClick={() => handleOpenQuickView(prod)}
                    className="p-2.5 bg-orange hover:bg-orange-hover text-white rounded-full transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ROW 4: CUPCAKES & ROW 5: PASTRIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <ProductRow 
          title="Artisanal Cream Cupcakes" 
          subtitle="Petite single-serve cups perfect for customized table spreads." 
          items={cupcakes} 
          onQuickView={handleOpenQuickView} 
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />

        <ProductRow 
          title="Fresh Cream Pastries" 
          subtitle="Individually sliced layers of forest berry and chocolate truffles." 
          items={pastries} 
          onQuickView={handleOpenQuickView} 
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />

      </section>

      {/* 6. TESTIMONIALS SLIDER SECTION WITH 3D TILT EFFECT */}
      <section className="bg-cream border-y border-border-color py-20 px-4 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 text-orange font-bold text-xs uppercase tracking-widest">
              <Quote className="w-4 h-4 text-orange" /> Customer Love Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-navy">The Amore Cakes Experience</h2>
          </div>

          {/* Testimonial Active Slider Card */}
          <div 
            onMouseMove={handleTestimonialMouseMove}
            onMouseLeave={handleTestimonialMouseLeave}
            style={tiltStyle}
            className="bg-card-bg border border-border-color p-8 md:p-12 rounded-3xl shadow-md max-w-2xl mx-auto cursor-pointer relative transition-all hover:shadow-lg"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange/15 p-3 rounded-full border border-orange/30">
              <Quote className="w-6 h-6 text-orange fill-orange" />
            </div>
            
            <div className="space-y-6 pt-2">
              <p className="text-navy/80 text-base md:text-lg italic font-medium leading-relaxed">
                &ldquo;{testimonials[testimonialIndex].text}&rdquo;
              </p>
              
              <div className="flex flex-col items-center gap-2">
                <img 
                  src={testimonials[testimonialIndex].avatar} 
                  alt={testimonials[testimonialIndex].name} 
                  className="w-14 h-14 rounded-full border-2 border-orange object-cover"
                />
                <div>
                  <h4 className="font-serif font-black text-navy text-base">{testimonials[testimonialIndex].name}</h4>
                  <p className="text-[10px] uppercase font-bold text-navy/50">{testimonials[testimonialIndex].role}</p>
                </div>
                <div className="flex gap-1 text-gold">
                  {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {testimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setTestimonialIndex(i)}
                className={`h-2 transition-all rounded-full ${i === testimonialIndex ? 'w-8 bg-orange' : 'w-2 bg-orange/20'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. SPECIAL MOMENTS & SHORTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-orange bg-orange/10 px-3.5 py-1 rounded-full border border-orange/15">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Interactive Showroom
            </span>
            <h2 className="text-3xl md:text-4.5xl font-serif font-black text-navy flex items-center gap-2">
              ✦ Special Moments ✦
            </h2>
            <p className="text-sm md:text-base text-navy/60 font-semibold max-w-xl">
              Celebrations, behind the scenes, and sweet memories. See our cake artistry in motion.
            </p>
          </div>
          <button 
            onClick={() => setShowAllShortsModal(true)}
            className="inline-flex items-center gap-2 border border-orange hover:bg-orange/5 text-orange font-black py-3 px-6 rounded-2xl text-xs transition-all tracking-wider self-start md:self-auto shadow-sm"
          >
            <Tv className="w-4 h-4" />
            <span>View All Videos</span>
          </button>
        </div>

        {/* Showcase Mockup Workspace Panel */}
        <div className="bg-[#FFFDF9] dark:bg-navy-dark/40 border border-border-color/60 p-6 md:p-10 rounded-[36px] shadow-lg">
          <div className="space-y-6">
            <div className="flex justify-between items-center pr-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></span>
                <span className="text-[10px] font-extrabold uppercase text-navy/50 tracking-wider">Interactive Video Carousel</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (shortsScrollRef.current) {
                      shortsScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
                    }
                  }}
                  className="p-2 border border-border-color/80 hover:bg-cream rounded-xl text-navy transition-all shadow-sm"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (shortsScrollRef.current) {
                      shortsScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
                    }
                  }}
                  className="p-2 border border-border-color/80 hover:bg-cream rounded-xl text-navy transition-all shadow-sm"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Slider Row */}
            <div 
              ref={shortsScrollRef}
              onScroll={() => {
                if (shortsScrollRef.current) {
                  const { scrollLeft, scrollWidth, clientWidth } = shortsScrollRef.current;
                  const maxScroll = scrollWidth - clientWidth;
                  if (maxScroll > 0) {
                    const idx = Math.round((scrollLeft / maxScroll) * 4);
                    setActiveDot(idx);
                  }
                }
              }}
              className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1"
            >
              {shortVideos.map((item, index) => {
                const liked = !!isLiked[item.id];
                const likesVal = likesCount[item.id] !== undefined ? likesCount[item.id] : item.likes;
                return (
                  <div 
                    key={item.id}
                    className="w-56 shrink-0 bg-white dark:bg-[#0D2A6B] border border-border-color/60 rounded-[28px] p-3 flex flex-col justify-between hover:scale-[1.02] hover:border-orange/60 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
                  >
                    {/* Video Thumbnail Container */}
                    <div className="rounded-[22px] overflow-hidden aspect-[9/14] border border-border-color/40 relative cursor-pointer" onClick={() => handleOpenVideoPlayer(item)}>
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Dark Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/35 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Top action: Featured badge or Likes overlay */}
                      {item.isFeatured && (
                        <span className="absolute top-3 left-3 bg-gold text-navy font-black text-[9px] px-2.5 py-1 rounded-full border border-gold-light/40 shadow-sm tracking-wider uppercase">
                          👑 Featured
                        </span>
                      )}

                      {/* Center: Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full glass border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-orange group-hover:border-transparent transition-all duration-300 animate-pulse-play">
                          <Play className="w-5 h-5 fill-white text-white translate-x-[1px]" />
                        </div>
                      </div>

                      {/* Bottom Info inside thumb: Duration */}
                      <span className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-sm text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full tracking-wider">
                        {item.duration}
                      </span>
                    </div>

                    {/* Video Caption & Metadata Below Thumbnail */}
                    <div className="mt-3.5 space-y-1 px-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-black text-navy text-sm group-hover:text-orange transition-colors cursor-pointer truncate flex-grow mr-2" onClick={() => handleOpenVideoPlayer(item)}>
                          {item.title}
                        </h3>
                        <button 
                          onClick={(e) => handleLikeShort(item.id, e)}
                          className="p-1 hover:bg-cream rounded-full text-navy/60 hover:text-red-500 transition-colors shrink-0"
                          title="Like moment"
                        >
                          <Heart className={`w-4 h-4 transition-transform active:scale-150 ${liked ? 'fill-red-500 text-red-500 scale-105' : ''}`} />
                        </button>
                      </div>
                      <p className="text-[11px] text-navy/50 font-semibold line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-black uppercase text-navy/40 pt-1.5 border-t border-border-color/20">
                        <span>{item.views} Views</span>
                        <span>{likesVal} Likes</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smooth Carousel Dots indicators */}
            <div className="flex justify-center gap-2.5 pt-2">
              {shortVideos.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    if (shortsScrollRef.current) {
                      const { scrollWidth, clientWidth } = shortsScrollRef.current;
                      const maxScroll = scrollWidth - clientWidth;
                      shortsScrollRef.current.scrollTo({
                        left: (i / 4) * maxScroll,
                        behavior: 'smooth'
                      });
                      setActiveDot(i);
                    }
                  }}
                  className={`h-2 transition-all duration-500 rounded-full ${i === activeDot ? 'w-10 bg-orange' : 'w-2 bg-orange/20 hover:bg-orange/45'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* 8. DETAILED FAQS SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3.5xl font-serif font-black text-navy">Frequently Asked Questions</h2>
          <p className="text-xs md:text-sm text-navy/60 font-semibold">Everything you need to know about custom cakes, delivery timetables, and freshness.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card-bg p-6 rounded-3xl border border-border-color space-y-2.5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-black text-navy text-base flex gap-2">
                <HelpCircle className="w-5 h-5 text-orange shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-navy/70 text-xs md:text-sm pl-7 leading-relaxed font-semibold">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. QUICK VIEW CUSTOMIZATION MODAL COMPONENT */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-card-bg rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border-color flex flex-col md:flex-row p-6 md:p-8 gap-8 shadow-2xl relative animate-float">
            
            {/* Close Cross */}
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 hover:bg-cream rounded-full text-navy transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Col Left: Product Images Slider */}
            <div className="w-full md:w-1/2 space-y-4 shrink-0">
              <div className="rounded-2xl overflow-hidden aspect-square border border-border-color">
                <img 
                  src={quickViewProduct.images[0]} 
                  alt={quickViewProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {quickViewProduct.images.slice(0, 3).map((img, i) => (
                  <img key={i} src={img} alt="thumb" className="w-full aspect-square object-cover rounded-xl border border-border-color hover:border-orange cursor-pointer" />
                ))}
              </div>
            </div>

            {/* Col Right: Customizations and Description */}
            <div className="flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest bg-orange/15 text-orange px-2.5 py-1 rounded-full border border-orange/25">Quick Customize Checkout</span>
                <h2 className="text-xl md:text-2xl font-serif font-black text-navy leading-tight">{quickViewProduct.name}</h2>
                
                {/* Pricing row */}
                <div className="flex items-baseline gap-2.5 pt-1">
                  <span className="text-orange font-extrabold text-2xl">₹{quickViewProduct.discountPrice || quickViewProduct.price}</span>
                  {quickViewProduct.discountPrice && (
                    <span className="text-navy/40 line-through text-sm font-bold">₹{quickViewProduct.price}</span>
                  )}
                </div>

                <p className="text-navy/70 text-xs md:text-sm leading-relaxed font-semibold">{quickViewProduct.description}</p>
              </div>

              {/* Weight selection */}
              {quickViewProduct.weights && quickViewProduct.weights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Select Weight (kg)</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.weights.map(w => (
                      <button 
                        key={w} 
                        onClick={() => setSelectedWeight(w)}
                        className={`text-xs font-black px-4 py-2 rounded-full border transition-all ${selectedWeight === w ? 'bg-orange text-white border-orange shadow-sm' : 'border-border-color hover:border-orange bg-background text-navy'}`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flavor selection */}
              {quickViewProduct.flavors && quickViewProduct.flavors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Select Flavor Option</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.flavors.map(f => (
                      <button 
                        key={f} 
                        onClick={() => setSelectedFlavor(f)}
                        className={`text-xs font-black px-4 py-2 rounded-full border transition-all ${selectedFlavor === f ? 'bg-orange text-white border-orange shadow-sm' : 'border-border-color hover:border-orange bg-background text-navy'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom message field */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-navy uppercase tracking-wider flex justify-between">
                  <span>Cake Inscription Message</span>
                  <span className="text-[9px] text-navy/50 font-semibold">Max 25 chars</span>
                </h4>
                <input 
                  type="text" 
                  maxLength={25}
                  placeholder="E.g. Happy Birthday Aditya!" 
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full text-xs font-semibold border border-border-color p-3 rounded-xl outline-none focus:ring-1 focus:ring-orange focus:border-transparent bg-background text-navy"
                />
              </div>

              {/* Eggless toggle checkbox */}
              {quickViewProduct.isEgglessOption && (
                <label className="flex items-center gap-2 text-xs font-black text-navy cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={isEggless} 
                    onChange={(e) => setIsEggless(e.target.checked)}
                    className="accent-orange rounded w-4 h-4"
                  />
                  <span>100% Pure Vegetarian Eggless Recipe (+ ₹50 applied)</span>
                </label>
              )}

              {/* Drawer Button Panel */}
              <div className="pt-4 border-t border-border-color flex gap-4">
                <button 
                  onClick={handleQuickViewAddToCart}
                  className="flex-1 bg-orange hover:bg-orange-hover text-white font-black py-3 rounded-2xl text-xs transition-all flex justify-center items-center gap-1.5 shadow-md gold-glow"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
                </button>
                <button 
                  onClick={() => { handleQuickViewAddToCart(); router.push('/cart'); }}
                  className="flex-1 bg-navy hover:bg-navy-dark text-white font-black py-3 rounded-2xl text-xs transition-all shadow-md"
                >
                  Buy Instantly Now
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

                {/* 9. MINIMALIST PORTRAIT SHORTS VIDEO PLAYER MODAL */}
      {activeVideo && (() => {
        const liked = !!isLiked[activeVideo.id];
        const likesVal = likesCount[activeVideo.id] !== undefined ? likesCount[activeVideo.id] : activeVideo.likes;
        const assocProduct = getAssociatedProduct(activeVideo);

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setActiveVideo(null)}>
            <div 
              className="relative w-full max-w-[380px] aspect-[9/16] bg-black rounded-[32px] overflow-hidden border border-white/10 shadow-2xl animate-float"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-40 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white border border-white/10 transition-all"
                title="Close Player"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Real HTML5 Video Stream */}
              <video
                src={activeVideo.videoUrl}
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                onTimeUpdate={(e) => {
                  const video = e.currentTarget;
                  if (video.duration) {
                    setVideoProgress((video.currentTime / video.duration) * 100);
                  }
                }}
                onError={() => {
                  setVideoLoadError(true);
                }}
                className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 ${videoLoadError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              />

              {/* Graceful CDN / CORS Fallback UI */}
              {videoLoadError && (
                <div className="absolute inset-0 w-full h-full z-10 bg-black flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
                  <img 
                    src={activeVideo.thumbnail} 
                    alt={activeVideo.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[4px]"
                  />
                  <div className="relative z-20 space-y-2 px-4">
                    <div className="w-11 h-11 rounded-full bg-orange/15 text-orange flex items-center justify-center mx-auto border border-orange/20 animate-pulse">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest pt-1.5">Footage Loading...</p>
                    <p className="text-[9px] text-white/60 font-semibold max-w-[210px] leading-relaxed mx-auto">We are preparing this vertical live preview. Quick Buy is active below!</p>
                  </div>
                </div>
              )}

              {/* Play / Pause Tap Overlay */}
              <div 
                className="absolute inset-0 z-20 cursor-pointer"
                onClick={(e) => {
                  const videoEl = e.currentTarget.parentElement?.querySelector('video');
                  if (videoEl) {
                    if (videoEl.paused) {
                      videoEl.play();
                    } else {
                      videoEl.pause();
                    }
                  }
                }}
                onDoubleClick={(e) => handleDoubleTapLike(activeVideo.id, e)}
              ></div>

              {/* Floating Heart Elements */}
              {heartAnimations.map(h => (
                <span 
                  key={h.id} 
                  style={{ left: h.x, top: h.y }} 
                  className="absolute z-30 text-red-500 animate-float-heart pointer-events-none"
                >
                  <Heart className="w-10 h-10 fill-red-500 text-red-500 drop-shadow-lg" />
                </span>
              ))}

              {/* Sidebar Action Bars */}
              <div className="absolute right-4 bottom-32 z-30 flex flex-col items-center gap-4 pointer-events-auto">
                {/* Like Button */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={(e) => handleLikeShort(activeVideo.id, e)}
                    className="w-10 h-10 rounded-full bg-black/55 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-120 hover:bg-orange transition-all shadow"
                  >
                    <Heart className={`w-4.5 h-4.5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                  <span className="text-[10px] font-extrabold text-white mt-1 drop-shadow-md">{likesVal}</span>
                </div>

                {/* Mute Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsVideoMuted(!isVideoMuted); }}
                  className="w-10 h-10 rounded-full bg-black/55 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:scale-105 transition-all shadow hover:bg-orange"
                  title={isVideoMuted ? "Unmute" : "Mute"}
                >
                  {isVideoMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                </button>

                {/* Share Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); showToast("Reels link copied! 📋", "success"); }}
                  className="w-10 h-10 rounded-full bg-black/55 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:scale-105 transition-all shadow hover:bg-orange"
                  title="Copy Link"
                >
                  <Send className="w-4 h-4 translate-x-[-0.5px] rotate-[-25deg]" />
                </button>
              </div>

              {/* Bottom Metadata & Shopping Pill */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-30 space-y-3 pointer-events-none">
                
                {/* Title & Description Overlay */}
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-black text-white leading-tight">{activeVideo.title}</h4>
                  <p className="text-[10.5px] text-white/80 font-semibold leading-normal line-clamp-2">{activeVideo.desc}</p>
                </div>

                {/* Premium Connected Product Tag */}
                {assocProduct && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl flex items-center justify-between gap-3 pointer-events-auto">
                    <div className="flex items-center gap-2">
                      <img 
                        src={assocProduct.images[0]} 
                        alt={assocProduct.name} 
                        className="w-10 h-10 object-cover rounded-xl border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-white truncate w-24 sm:w-28 leading-none">{assocProduct.name}</h4>
                        <p className="text-[10px] text-orange font-black mt-1 leading-none">₹{assocProduct.discountPrice || assocProduct.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(
                          assocProduct,
                          1,
                          assocProduct.weights ? assocProduct.weights[0] : '0.5kg',
                          assocProduct.flavors ? assocProduct.flavors[0] : 'Standard Chocolate',
                          true,
                          ''
                        );
                        showToast(`${assocProduct.name} added to cart! 🍰`, "success");
                      }}
                      className="py-1.5 px-3 bg-orange hover:bg-orange-hover text-white rounded-xl text-[9px] font-black transition-all shadow-md shrink-0 uppercase tracking-wider"
                    >
                      Quick Buy
                    </button>
                  </div>
                )}

                {/* Video Playback Progress Bar */}
                <div className="h-0.5 bg-white/20 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-orange transition-all duration-100" style={{ width: `${videoProgress}%` }}></div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* 10. CATALOG SHOWCASE MODAL: VIEW ALL SHORT VIDEOS */}
      {showAllShortsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowAllShortsModal(false)}>
          <div 
            className="bg-card-bg text-navy rounded-[32px] max-w-5xl w-full max-h-[85vh] overflow-y-auto border border-border-color p-6 md:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Cross button */}
            <button 
              onClick={() => setShowAllShortsModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-cream rounded-full text-navy transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="border-b border-border-color pb-3">
              <h2 className="font-serif font-black text-2xl text-navy">Special Moments Grid Showcase</h2>
              <p className="text-xs text-navy/55 font-semibold">Our full library of live bake-offs, tutorials, and customer reactions</p>
            </div>

            {/* Video Shorts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {shortVideos.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { handleOpenVideoPlayer(item); setShowAllShortsModal(false); }}
                  className="bg-background border border-border-color/60 rounded-2xl p-2 cursor-pointer hover:border-orange hover:scale-102 transition-all group flex flex-col justify-between"
                >
                  <div className="rounded-xl overflow-hidden aspect-[9/14] relative">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-103" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center text-white">
                        <Play className="w-3.5 h-3.5 fill-white text-white translate-x-[0.5px]" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{item.duration}</span>
                  </div>
                  <div className="mt-2.5 px-0.5 space-y-0.5">
                    <h4 className="font-serif font-black text-xs text-navy truncate leading-tight group-hover:text-orange">{item.title}</h4>
                    <p className="text-[9px] text-navy/50 font-semibold truncate">{item.views} Views</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border-color flex justify-end">
              <button 
                onClick={() => setShowAllShortsModal(false)}
                className="px-6 py-2.5 bg-navy text-white rounded-xl text-xs font-black hover:bg-navy-dark transition-all"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// HORIZONTAL PRODUCT LIST SCROLLER UTILITY WRAPPER
function ProductRow({ title, subtitle, items, onQuickView, addToCart, wishlist, toggleWishlist }) {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmt = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth'
      });
    }
  };

  const handleSimpleAddToCart = (prod) => {
    addToCart(
      prod,
      1,
      prod.weights ? prod.weights[0] : '0.5kg',
      prod.flavors ? prod.flavors[0] : 'Standard Chocolate',
      true, // eggless
      '' // message
    );
  };

  return (
    <div className="space-y-4 relative group/row">
      <div className="flex justify-between items-end pr-2">
        <div>
          <h2 className="text-xl md:text-2.5xl font-serif font-black text-navy">{title}</h2>
          <p className="text-xs md:text-sm text-navy/60 font-semibold">{subtitle}</p>
        </div>
        <div className="flex gap-1.5">
          <button 
            onClick={() => scroll('left')}
            className="p-1.5 border border-border-color hover:bg-cream rounded-full text-navy transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-1.5 border border-border-color hover:bg-cream rounded-full text-navy transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 px-1"
      >
        {items.map((prod) => {
          const isWishlisted = wishlist.includes(prod._id);
          return (
            <div 
              key={prod._id}
              className="w-64 shrink-0 bg-card-bg border border-border-color rounded-3xl p-4 flex flex-col justify-between group hover:border-orange amore-card shadow-sm transition-all duration-300 relative overflow-hidden"
            >
              {/* Wishlist Button */}
              <button 
                onClick={() => toggleWishlist(prod._id)}
                className="absolute top-4 right-4 p-1.5 bg-card-bg hover:bg-cream border border-border-color rounded-full text-navy transition-colors z-20 shadow-sm"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-navy/60'}`} />
              </button>

              {/* Product Card Click leads to Details */}
              <Link href={`/product/${prod.slug}`} className="space-y-3 cursor-pointer relative block">
                <div className="rounded-2xl overflow-hidden h-40 aspect-video border border-border-color relative">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  {prod.isPremium && (
                    <span className="absolute bottom-2 left-2 bg-orange text-white font-black text-[9px] px-2 py-0.5 rounded-full border border-orange/40">Premium</span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="flex text-gold">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    </div>
                    <span className="text-[10px] font-black text-navy">{prod.rating} ({prod.reviewsCount} orders)</span>
                  </div>
                  <h3 className="font-serif font-black text-navy text-sm truncate leading-tight group-hover:text-orange transition-colors">{prod.name}</h3>
                </div>
              </Link>

              {/* Lower Section: Price and Cart trigger */}
              <div className="mt-3 pt-3 border-t border-border-color flex items-center justify-between">
                <div>
                  <span className="text-orange font-black text-base">₹{prod.discountPrice || prod.price}</span>
                  {prod.discountPrice && (
                    <span className="text-navy/40 line-through text-xs ml-1 font-bold">₹{prod.price}</span>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => onQuickView(prod)}
                    className="p-1.5 border border-border-color hover:bg-cream rounded-full text-navy transition-all"
                    title="Quick Customize View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleSimpleAddToCart(prod)}
                    className="p-1.5 bg-orange hover:bg-orange-hover hover:scale-105 text-white rounded-full transition-all shadow-sm"
                    title="Add to Shopping Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
