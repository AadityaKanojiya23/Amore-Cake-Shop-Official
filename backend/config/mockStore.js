const generateId = () => Math.random().toString(36).substring(2, 11);

export const categories = [
  { name: 'Cakes', slug: 'cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300' },
  { name: 'Birthday Cakes', slug: 'birthday-cakes', image: 'https://images.unsplash.com/photo-1533782654613-826a072dd6f3?auto=format&fit=crop&q=80&w=300' },
  { name: 'Wedding Cakes', slug: 'wedding-cakes', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=300' },
  { name: 'Anniversary Cakes', slug: 'anniversary-cakes', image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Chocolate Cakes', slug: 'chocolate-cakes', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=300' },
  { name: 'Designer Cakes', slug: 'designer-cakes', image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Cupcakes', slug: 'cupcakes', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=300' },
  { name: 'Pastries', slug: 'pastries', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Bento Cakes', slug: 'bento-cakes', image: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&q=80&w=300' },
  { name: 'Photo Cakes', slug: 'photo-cakes', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=300' },
  { name: 'Eggless Cakes', slug: 'eggless-cakes', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=300' },
  { name: 'Premium Cakes', slug: 'premium-cakes', image: 'https://images.unsplash.com/photo-1562266648-a47af8e9e4f2?auto=format&fit=crop&q=80&w=300' },
  { name: 'Party Decor', slug: 'party-decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=300' },
  { name: 'Candles', slug: 'candles', image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=300' },
  { name: 'Flowers', slug: 'flowers', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=300' },
  { name: 'Chocolates', slug: 'chocolates', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=300' },
  { name: 'Gifts', slug: 'gifts', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300' },
  { name: 'Combos', slug: 'combos', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=300' }
];

export const coupons = [
  { _id: 'c1', code: 'SWEETCRAVE10', discountType: 'percentage', discountAmount: 10, minPurchase: 500, maxDiscount: 200, expiryDate: new Date('2027-12-31'), isActive: true, usageCount: 15 },
  { _id: 'c2', code: 'BASH200', discountType: 'fixed', discountAmount: 200, minPurchase: 1500, expiryDate: new Date('2027-12-31'), isActive: true, usageCount: 42 },
  { _id: 'c3', code: 'FREECAKE', discountType: 'percentage', discountAmount: 100, minPurchase: 5000, maxDiscount: 1000, expiryDate: new Date('2027-12-31'), isActive: true, usageCount: 2 },
  { _id: 'c4', code: 'WELCOME15', discountType: 'percentage', discountAmount: 15, minPurchase: 400, maxDiscount: 150, expiryDate: new Date('2027-12-31'), isActive: true, usageCount: 120 }
];

// Helper to generate 100+ cake products dynamically
const cakeFlavors = ['Belgian Chocolate', 'Red Velvet Cheese', 'Classic Vanilla Bean', 'Rich Butterscotch', 'Forest Berry', 'Fresh Mango Cream', 'Premium Pineapple', 'Tiramisu Fusion', 'Dark Chocolate Truffle', 'Strawberry Delight'];
const cakeImages = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1533782654613-826a072dd6f3?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1562266648-a47af8e9e4f2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600'
];

const giftImages = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=600'
];

export const generateProducts = () => {
  const list = [];
  let idCounter = 1;
  const slugsSet = new Set();

  categories.forEach((cat) => {
    // Determine number of items per category to reach 100+ items (18 categories x 6 items = 108 products)
    const count = 6;
    for (let i = 1; i <= count; i++) {
      const isCakeCat = ['cakes', 'birthday-cakes', 'wedding-cakes', 'anniversary-cakes', 'chocolate-cakes', 'designer-cakes', 'bento-cakes', 'photo-cakes', 'eggless-cakes', 'premium-cakes'].includes(cat.slug);
      
      const flavorIndex = (idCounter + i) % cakeFlavors.length;
      const mainFlavor = cakeFlavors[flavorIndex];
      const name = isCakeCat 
        ? `${cat.name === 'Cakes' ? 'Signature' : cat.name.replace(' Cakes', '')} ${mainFlavor} Cake`
        : `${cat.name} Premium Special ${i}`;
      
      let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (slugsSet.has(slug)) {
        slug = `${slug}-${cat.slug}`;
      }
      slugsSet.add(slug);
      const price = isCakeCat ? 499 + (idCounter % 5) * 150 : 150 + (idCounter % 4) * 80;
      const discountPrice = Math.round(price * 0.85); // 15% discount
      
      const categoryImages = isCakeCat ? cakeImages : giftImages;
      const img1 = categoryImages[(idCounter + i) % categoryImages.length];
      const img2 = categoryImages[(idCounter + i + 1) % categoryImages.length];
      const img3 = categoryImages[(idCounter + i + 2) % categoryImages.length];

      list.push({
        _id: generateId(), // Generate a realistic MongoDB ObjectId
        name,
        slug,
        category: cat.slug,
        description: `Indulge in our exquisite ${name}, baked fresh with premium ingredients. Perfect for celebrations, gifting, or satisfying your sweet cravings. Fully customizable by weight, flavor, and eggless preferences.`,
        longDescription: `This gourmet product represents the pinnacle of baking craft. Prepared under strict hygiene standards using imported cocoa, fresh farm dairy, and artisanal techniques. Each item is hand-decorated to order to ensure that your celebratory moments are perfectly matched with visual and culinary brilliance. Serves as an unforgettable center-piece for any special event.`,
        ingredients: isCakeCat 
          ? ['Premium Wheat Flour', 'Farm-fresh Cream', 'Fine Belgian Chocolate', 'Organic Sugar', 'Vanilla Pod extract', 'Buttercream frosting']
          : ['Fine raw materials', 'Organic dyes', 'Natural aromatic essences', 'High-grade craftsmanship'],
        images: [img1, img2, img3],
        price,
        discountPrice,
        rating: +(4.1 + (idCounter % 9) * 0.1).toFixed(1),
        reviewsCount: 12 + (idCounter % 45),
        inventory: 15 + (idCounter % 30),
        weights: isCakeCat ? ['0.5kg', '1.0kg', '1.5kg', '2.0kg'] : ['Standard Fit'],
        flavors: isCakeCat ? [mainFlavor, ...cakeFlavors.filter(f => f !== mainFlavor).slice(0, 3)] : ['Default'],
        isEgglessOption: isCakeCat,
        isFeatured: idCounter % 8 === 0 || cat.slug === 'premium-cakes' && i === 1,
        isPremium: cat.slug === 'premium-cakes' || idCounter % 12 === 0,
        isTrending: idCounter % 7 === 1,
        isBestSeller: idCounter % 9 === 2,
        tags: isCakeCat ? ['fresh', 'premium', 'eggless-available', cat.slug] : ['gift', 'accessory', cat.slug],
        createdAt: new Date(Date.now() - (idCounter * 24 * 60 * 60 * 1000)) // incrementally older dates
      });
      idCounter++;
    }
  });

  return list;
};

// Generate in-memory lists
export let mockProducts = generateProducts();
export let mockUsers = [
  {
    _id: 'u1',
    name: 'ShubhAdi',
    email: 'shubhadi2026@gmail.com',
    password: '$2a$10$tZre5b9yDkC7y3gH9m.JBeWfWeqYtV7r6A8l9S2k5bZ7x8D6g5D6y', // bcrypt for 'password123'
    role: 'user',
    avatar: 'https://i.ibb.co/k2WqSjyN/4cd54da7-aa9a-4555-9569-16d98e04b6b7.png',
    addresses: [
      { _id: 'a1', name: 'ShubhAdi', phone: '9876543210', street: 'Flat 405, Sweet Meadows', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001', isDefault: true },
      { _id: 'a2', name: 'ShubhAdi Office', phone: '9876543211', street: 'Tech Hub, Bandra Kurla Complex', city: 'Mumbai', state: 'Maharashtra', zipCode: '400051', isDefault: false }
    ],
    wishlist: [mockProducts[0]._id, mockProducts[5]._id],
    createdAt: new Date('2026-01-01')
  },
  {
    _id: 'u2',
    name: 'SweetCrave Admin',
    email: 'admin@sweetcrave.com',
    password: '$2a$10$tZre5b9yDkC7y3gH9m.JBeWfWeqYtV7r6A8l9S2k5bZ7x8D6g5D6y', // bcrypt for 'password123'
    role: 'admin',
    avatar: 'https://i.ibb.co/k2WqSjyN/4cd54da7-aa9a-4555-9569-16d98e04b6b7.png',
    addresses: [],
    wishlist: [],
    createdAt: new Date('2026-01-01')
  }
];

export let mockOrders = [
  {
    _id: 'o1',
    invoiceNumber: 'INV-2026-001',
    user: 'u1',
    items: [
      {
        product: mockProducts[0]._id,
        name: mockProducts[0].name,
        image: mockProducts[0].images[0],
        weight: '1.0kg',
        flavor: mockProducts[0].flavors[0],
        isEggless: true,
        quantity: 1,
        price: mockProducts[0].discountPrice || mockProducts[0].price,
        cakeMessage: 'Happy Birthday ShubhAdi!',
        addCandles: true,
        addFlowers: false,
        addChocolates: true
      }
    ],
    shippingAddress: {
      name: 'ShubhAdi',
      phone: '9876543210',
      street: 'Flat 405, Sweet Meadows',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    deliveryDetails: {
      date: new Date(Date.now() - 24 * 3600000).toISOString().split('T')[0], // Yesterday
      timeSlot: 'Midnight (11 PM - 12 AM)',
      type: 'Midnight'
    },
    payment: {
      method: 'CARD',
      status: 'Paid',
      advancePaid: 0,
      balanceDue: 0,
      razorpayOrderId: 'order_pay_mock123',
      razorpayPaymentId: 'pay_mock_abc123',
      transactionId: 'tx_mock_98765'
    },
    pricing: {
      subtotal: mockProducts[0].discountPrice || mockProducts[0].price,
      gstAmount: Math.round((mockProducts[0].discountPrice || mockProducts[0].price) * 0.05),
      shippingCharge: 150, // midnight shipping premium
      discountApplied: 0,
      totalAmount: Math.round((mockProducts[0].discountPrice || mockProducts[0].price) * 1.05) + 150
    },
    status: 'Baking',
    timeline: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 3600000), note: 'Order placed successfully.' },
      { status: 'Baking', timestamp: new Date(Date.now() - 1 * 3600000), note: 'Our chef is preparing your signature cake.' }
    ],
    createdAt: new Date(Date.now() - 3 * 3600000)
  },
  {
    _id: 'o2',
    invoiceNumber: 'INV-2026-002',
    user: 'u1',
    items: [
      {
        product: mockProducts[2]._id,
        name: mockProducts[2].name,
        image: mockProducts[2].images[0],
        weight: '0.5kg',
        flavor: mockProducts[2].flavors[0],
        isEggless: false,
        quantity: 2,
        price: mockProducts[2].discountPrice || mockProducts[2].price,
        cakeMessage: 'Happy Anniversary Mom & Dad!',
        addCandles: false,
        addFlowers: true,
        addChocolates: false
      }
    ],
    shippingAddress: {
      name: 'ShubhAdi',
      phone: '9876543210',
      street: 'Flat 405, Sweet Meadows',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    deliveryDetails: {
      date: new Date().toISOString().split('T')[0], // Today
      timeSlot: 'Standard (12 PM - 6 PM)',
      type: 'Standard'
    },
    payment: {
      method: 'COD',
      status: 'Partially Paid',
      advancePaid: Math.round(((mockProducts[2].discountPrice || mockProducts[2].price) * 2) * 0.3), // 30% advance
      balanceDue: Math.round(((mockProducts[2].discountPrice || mockProducts[2].price) * 2) * 0.7) + 50, // 70% + shipping
      razorpayOrderId: 'order_cod_mock456',
      razorpayPaymentId: 'pay_cod_mock456',
      transactionId: 'tx_cod_99182'
    },
    pricing: {
      subtotal: (mockProducts[2].discountPrice || mockProducts[2].price) * 2,
      gstAmount: Math.round(((mockProducts[2].discountPrice || mockProducts[2].price) * 2) * 0.05),
      shippingCharge: 50,
      discountApplied: 0,
      totalAmount: Math.round(((mockProducts[2].discountPrice || mockProducts[2].price) * 2) * 1.05) + 50
    },
    status: 'Confirmed',
    timeline: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 12 * 3600000), note: 'Order placed. 30% advance payment verified.' }
    ],
    createdAt: new Date(Date.now() - 12 * 3600000)
  }
];

export let mockReviews = [
  { _id: 'r1', product: mockProducts[0]._id, user: 'u1', userName: 'ShubhAdi', userAvatar: 'https://i.ibb.co/k2WqSjyN/4cd54da7-aa9a-4555-9569-16d98e04b6b7.png', rating: 5, comment: 'Hands down the best cake I have ever had! The chocolate was so rich and the delivery was perfectly on time at midnight.', isApproved: true, createdAt: new Date() },
  { _id: 'r2', product: mockProducts[1]._id, user: 'u1', userName: 'ShubhAdi', userAvatar: 'https://i.ibb.co/k2WqSjyN/4cd54da7-aa9a-4555-9569-16d98e04b6b7.png', rating: 4, comment: 'Very soft and delicious. The red velvet layers were perfect. Highly recommend.', isApproved: true, createdAt: new Date() }
];

// Fallback Controller Utilities that emulate DB queries
export const getProductsStore = () => mockProducts;
export const getUsersStore = () => mockUsers;
export const getOrdersStore = () => mockOrders;
export const getReviewsStore = () => mockReviews;
export const getCouponsStore = () => coupons;
export const getCategoriesStore = () => categories;

// MUTATORS
export const addProductStore = (prod) => {
  const newProd = { _id: generateId(), ...prod, createdAt: new Date() };
  mockProducts.unshift(newProd);
  return newProd;
};

export const updateProductStore = (id, updates) => {
  const index = mockProducts.findIndex(p => p._id === id);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...updates };
    return mockProducts[index];
  }
  return null;
};

export const deleteProductStore = (id) => {
  const index = mockProducts.findIndex(p => p._id === id);
  if (index !== -1) {
    const deleted = mockProducts[index];
    mockProducts.splice(index, 1);
    return deleted;
  }
  return null;
};

export const addOrderStore = (order) => {
  const invoiceNumber = `INV-2026-${String(mockOrders.length + 1).padStart(3, '0')}`;
  const newOrder = {
    _id: generateId(),
    invoiceNumber,
    status: 'Confirmed',
    timeline: [{ status: 'Confirmed', timestamp: new Date(), note: 'Order created successfully.' }],
    createdAt: new Date(),
    ...order
  };
  mockOrders.unshift(newOrder);
  return newOrder;
};

export const updateOrderStore = (id, status, note) => {
  const index = mockOrders.findIndex(o => o._id === id);
  if (index !== -1) {
    mockOrders[index].status = status;
    mockOrders[index].timeline.push({ status, timestamp: new Date(), note });
    return mockOrders[index];
  }
  return null;
};

export const addUserStore = (user) => {
  const newUser = { _id: generateId(), addresses: [], wishlist: [], role: 'user', createdAt: new Date(), ...user };
  mockUsers.push(newUser);
  return newUser;
};

export const addReviewStore = (review) => {
  const newReview = { _id: generateId(), isApproved: true, createdAt: new Date(), ...review };
  mockReviews.unshift(newReview);
  return newReview;
};
