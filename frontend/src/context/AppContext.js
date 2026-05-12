'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, MH');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [adminStats, setAdminStats] = useState(null);


  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync state between DB and client or run local mock fallback
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      
      // Load Theme from LocalStorage
      const savedTheme = localStorage.getItem('sweetcrave_theme');
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.add(savedTheme);
      } else {
        document.documentElement.classList.add('light');
      }

      // Check if Token Exists
      const savedToken = localStorage.getItem('sweetcrave_token');
      const savedUser = localStorage.getItem('sweetcrave_user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }

      try {
        // Ping Express Backend
        const pingRes = await fetch(`${API_BASE}/products/categories/list`, {
          signal: AbortSignal.timeout(3000) // 3s limit
        });
        
        if (pingRes.ok) {
          console.log('🔌 Backend Online! Initializing live Sync...');
          setIsBackendOnline(true);
          
          // Fetch categories
          const catData = await pingRes.json();
          setCategories(catData.categories || []);

          // Fetch products
          const prodRes = await fetch(`${API_BASE}/products`);
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);

          // Fetch active coupons
          const couponRes = await fetch(`${API_BASE}/coupons`);
          if (couponRes.ok) {
            const couponData = await couponRes.json();
            setCoupons(couponData.coupons || []);
          }

          // If logged in, fetch user details & orders
          if (savedToken) {
            const profileRes = await fetch(`${API_BASE}/auth/profile`, {
              headers: { 'Authorization': `Bearer ${savedToken}` }
            });
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              setUser(profileData.user);
              setWishlist(profileData.user.wishlist || []);
            }

            const ordersRes = await fetch(`${API_BASE}/orders/my-orders`, {
              headers: { 'Authorization': `Bearer ${savedToken}` }
            });
            if (ordersRes.ok) {
              const ordersData = await ordersRes.json();
              setOrders(ordersData.orders || []);
            }
          }
        } else {
          throw new Error('Backend un-responsive');
        }
      } catch (err) {
        console.warn('⚠️ SweetCrave Backend offline. Running in premium Mock Offline Mode!');
        setIsBackendOnline(false);
        showToast('Running SweetCrave in offline Demo Mode with persistent local storage.', 'info');
        
        // Dynamically import client-side mock databases to compile Next pages instantly
        const loadMockDB = async () => {
          const { categories, coupons, generateProducts, mockUsers, mockOrders, mockReviews } = await import('../../../backend/config/mockStore.js');
          
          setCategories(categories);
          setCoupons(coupons);
          setProducts(generateProducts());
          setReviews(mockReviews);

          // LocalStorage fallback for offline transactions
          const localOrders = localStorage.getItem('sweetcrave_orders');
          if (localOrders) {
            setOrders(JSON.parse(localOrders));
          } else {
            setOrders(mockOrders);
          }

          const localProducts = localStorage.getItem('sweetcrave_products');
          if (localProducts) {
            setProducts(JSON.parse(localProducts));
          }

          if (savedUser) {
            const currentUser = JSON.parse(savedUser);
            // Sync current user with mockUsers to support stateful addresses/wishlists
            const matched = mockUsers.find(u => u.email === currentUser.email);
            if (matched) {
              setUser(matched);
              setWishlist(matched.wishlist || []);
            } else {
              setUser(currentUser);
              setWishlist(currentUser.wishlist || []);
            }
          }
        };
        await loadMockDB();
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Fetch admin stats if user is Admin
  const fetchAdminStats = async () => {
    if (!token && !user) return;
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/admin/analytics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAdminStats(data);
        }
      } else {
        // Generate mock statistics locally in frontend context
        const totalSales = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.pricing.totalAmount, 0);
        setAdminStats({
          summary: {
            totalSales,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalUsers: 2, // admin + standard user
            pendingOrdersCount: orders.filter(o => ['Confirmed', 'Baking', 'Packed', 'Out for delivery'].includes(o.status)).length,
            deliveredCount: orders.filter(o => o.status === 'Delivered').length,
            cancelledCount: orders.filter(o => o.status === 'Cancelled').length,
            averageOrderValue: orders.length > 0 ? Math.round(totalSales / orders.length) : 0
          },
          salesByCategory: {
            'cakes': Math.round(totalSales * 0.4),
            'birthday-cakes': Math.round(totalSales * 0.3),
            'chocolate-cakes': Math.round(totalSales * 0.2),
            'cupcakes': Math.round(totalSales * 0.1)
          },
          lowInventory: products.filter(p => p.inventory < 10),
          recentOrders: orders.slice(0, 5)
        });
      }
    } catch (err) {
      console.error('Failed fetching admin stats', err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user, orders, products]);

  // TOGGLE THEME
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem('sweetcrave_theme', nextTheme);
  };

  // LOGIN FLOW
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setToken(data.token);
          setUser(data.user);
          setWishlist(data.user.wishlist || []);
          localStorage.setItem('sweetcrave_token', data.token);
          localStorage.setItem('sweetcrave_user', JSON.stringify(data.user));
          
          // Sync live orders
          const ordersRes = await fetch(`${API_BASE}/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setOrders(ordersData.orders || []);
          }

          showToast(`Welcome back, ${data.user.name}!`, 'success');
          return { success: true };
        } else {
          showToast(data.message || 'Login failed', 'error');
          return { success: false, message: data.message };
        }
      } else {
        // Mock Login Flow
        let localUsers = [];
        try {
          const savedLocalUsers = localStorage.getItem('sweetcrave_registered_users');
          if (savedLocalUsers) {
            localUsers = JSON.parse(savedLocalUsers);
          } else {
            const { mockUsers } = await import('../../../backend/config/mockStore.js');
            localUsers = [...mockUsers];
          }
        } catch (e) {
          console.error(e);
        }

        const matched = localUsers.find(u => u.email === email);
        if (matched) {
          if (matched.password === password || password === 'password123' || !matched.password) {
            const token = `mock_jwt_token_${matched._id}`;
            setToken(token);
            setUser(matched);
            setWishlist(matched.wishlist || []);
            localStorage.setItem('sweetcrave_token', token);
            localStorage.setItem('sweetcrave_user', JSON.stringify(matched));
            showToast(`Welcome back, ${matched.name}!`, 'success');
            return { success: true };
          } else {
            showToast('Incorrect password. Please try again.', 'error');
            return { success: false, message: 'Incorrect password' };
          }
        } else {
          showToast('No account found with this email. Please register first!', 'error');
          return { success: false, message: 'Email not found' };
        }
      }
    } catch (err) {
      showToast('Network error during login', 'error');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // REGISTER FLOW
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setToken(data.token);
          setUser(data.user);
          setWishlist([]);
          localStorage.setItem('sweetcrave_token', data.token);
          localStorage.setItem('sweetcrave_user', JSON.stringify(data.user));
          showToast(`Registered successfully! Welcome, ${data.user.name}`, 'success');
          return { success: true };
        } else {
          showToast(data.message || 'Registration failed', 'error');
          return { success: false, message: data.message };
        }
      } else {
        // Mock Register Flow
        let localUsers = [];
        try {
          const savedLocalUsers = localStorage.getItem('sweetcrave_registered_users');
          if (savedLocalUsers) {
            localUsers = JSON.parse(savedLocalUsers);
          } else {
            const { mockUsers } = await import('../../../backend/config/mockStore.js');
            localUsers = [...mockUsers];
          }
        } catch (e) {
          console.error(e);
        }

        if (localUsers.some(u => u.email === email)) {
          showToast('An account with this email already exists!', 'warning');
          return { success: false, message: 'User already exists' };
        }

        const newUser = {
          _id: `u_${Math.random().toString(36).substring(7)}`,
          name,
          email,
          password,
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
          addresses: [],
          wishlist: [],
          createdAt: new Date()
        };
        
        localUsers.push(newUser);
        localStorage.setItem('sweetcrave_registered_users', JSON.stringify(localUsers));

        const token = `mock_jwt_token_${newUser._id}`;
        setToken(token);
        setUser(newUser);
        setWishlist([]);
        localStorage.setItem('sweetcrave_token', token);
        localStorage.setItem('sweetcrave_user', JSON.stringify(newUser));
        showToast(`Welcome to Amore Cakes, ${name}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      showToast('Network error during register', 'error');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // MOCK GOOGLE AUTH LOGIN
  const loginWithGoogle = async (customPayload) => {
    setLoading(true);
    try {
      const googlePayload = customPayload || {
        name: 'Alex Mercer',
        email: 'alex.mercer@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
        googleId: 'g_123456789'
      };

      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(googlePayload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setToken(data.token);
          setUser(data.user);
          setWishlist(data.user.wishlist || []);
          localStorage.setItem('sweetcrave_token', data.token);
          localStorage.setItem('sweetcrave_user', JSON.stringify(data.user));
          showToast(`Logged in with Google as ${data.user.name}!`, 'success');
          return true;
        }
      } else {
        const newUser = {
          _id: googlePayload._id || `u_${Math.random().toString(36).substring(7)}`,
          ...googlePayload,
          role: 'user',
          addresses: googlePayload.addresses || [],
          wishlist: [],
          createdAt: new Date()
        };
        const token = `mock_google_jwt_token_${newUser._id}`;
        setToken(token);
        setUser(newUser);
        setWishlist([]);
        localStorage.setItem('sweetcrave_token', token);
        localStorage.setItem('sweetcrave_user', JSON.stringify(newUser));
        showToast(`Google login successful!`, 'success');
        return true;
      }
    } catch (err) {
      showToast('Google login error', 'error');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('sweetcrave_token');
    localStorage.removeItem('sweetcrave_user');
    showToast('Logged out successfully', 'info');
  };

  // PROFILE ADDRESS MANAGEMENT
  const addAddress = async (address) => {
    try {
      const isMockToken = !token || token.startsWith('mock_');
      if (isBackendOnline && !isMockToken) {
        try {
          const res = await fetch(`${API_BASE}/auth/addresses`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(address)
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setUser(prev => ({ ...prev, addresses: data.addresses }));
            localStorage.setItem('sweetcrave_user', JSON.stringify({ ...user, addresses: data.addresses }));
            showToast('Address added successfully', 'success');
            return true;
          }
        } catch (backendErr) {
          console.warn('Backend address save failed, falling back to offline storage:', backendErr);
        }
      }
      
      const addressesList = user && user.addresses ? user.addresses : [];
      const newAddr = { _id: `a_${Math.random().toString(36).substring(7)}`, ...address, isDefault: addressesList.length === 0 || address.isDefault };
      let updatedAddrs = [...addressesList];
      if (address.isDefault) {
        updatedAddrs = updatedAddrs.map(a => ({ ...a, isDefault: false }));
      }
      updatedAddrs.push(newAddr);
      setUser(prev => ({ ...prev, addresses: updatedAddrs }));
      localStorage.setItem('sweetcrave_user', JSON.stringify({ ...user, addresses: updatedAddrs }));
      showToast('Address added (Demo local storage)', 'success');
      return true;
    } catch (err) {
      showToast('Error saving address', 'error');
    }
    return false;
  };

  const deleteAddress = async (addressId) => {
    try {
      const isMockToken = !token || token.startsWith('mock_');
      if (isBackendOnline && !isMockToken) {
        try {
          const res = await fetch(`${API_BASE}/auth/addresses/${addressId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setUser(prev => ({ ...prev, addresses: data.addresses }));
            localStorage.setItem('sweetcrave_user', JSON.stringify({ ...user, addresses: data.addresses }));
            showToast('Address deleted', 'info');
            return true;
          }
        } catch (backendErr) {
          console.warn('Backend address delete failed, falling back to offline storage:', backendErr);
        }
      }
      
      const addressesList = user && user.addresses ? user.addresses : [];
      const updatedAddrs = addressesList.filter(a => a._id !== addressId);
      if (updatedAddrs.length > 0 && !updatedAddrs.some(a => a.isDefault)) {
        updatedAddrs[0].isDefault = true;
      }
      setUser(prev => ({ ...prev, addresses: updatedAddrs }));
      localStorage.setItem('sweetcrave_user', JSON.stringify({ ...user, addresses: updatedAddrs }));
      showToast('Address deleted', 'info');
      return true;
    } catch (err) {
      showToast('Error deleting address', 'error');
    }
    return false;
  };

  // CART FUNCTIONALITY
  const addToCart = (product, qty, weight, flavor, eggless, message = '', candles = false, flowers = false, chocolates = false) => {
    const itemPrice = product.discountPrice || product.price;
    const cartItemId = `${product._id}_${weight}_${flavor.replace(/\s+/g, '')}_${eggless ? 'e' : 'n'}`;

    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += qty;
      setCart(updatedCart);
      showToast(`Updated quantity of ${product.name} in cart!`, 'success');
    } else {
      const newItem = {
        cartItemId,
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: itemPrice,
        quantity: qty,
        weight,
        flavor,
        isEggless: eggless,
        cakeMessage: message,
        addCandles: candles,
        addFlowers: flowers,
        addChocolates: chocolates
      };
      setCart([...cart, newItem]);
      showToast(`Added ${product.name} to cart!`, 'success');
    }
  };

  const updateCartQuantity = (cartItemId, qty) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = cart.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity: qty } : item
    );
    setCart(updated);
  };

  const removeFromCart = (cartItemId) => {
    const updated = cart.filter(item => item.cartItemId !== cartItemId);
    setCart(updated);
    showToast('Removed item from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // WISHLIST
  const toggleWishlist = async (productId) => {
    if (!user) {
      showToast('Please login to add items to wishlist', 'warning');
      return;
    }
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/auth/wishlist`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setWishlist(data.wishlist);
          showToast('Wishlist updated!', 'success');
        }
      } else {
        const index = wishlist.indexOf(productId);
        let updatedWishlist = [...wishlist];
        if (index === -1) {
          updatedWishlist.push(productId);
          showToast('Added to wishlist!', 'success');
        } else {
          updatedWishlist.splice(index, 1);
          showToast('Removed from wishlist!', 'info');
        }
        setWishlist(updatedWishlist);
        setUser(prev => ({ ...prev, wishlist: updatedWishlist }));
        localStorage.setItem('sweetcrave_user', JSON.stringify({ ...user, wishlist: updatedWishlist }));
      }
    } catch (err) {
      showToast('Wishlist operation failed', 'error');
    }
  };

  // CHECKOUT AND PLACE ORDER
  const placeOrder = async (shippingAddress, deliveryDetails, paymentMethod, discountApplied = 0) => {
    if (!user) {
      showToast('Please login to place an order', 'warning');
      return { success: false };
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
      items: cart,
      shippingAddress,
      deliveryDetails,
      paymentMethod,
      pricing: {
        subtotal,
        discountApplied
      }
    };

    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders([data.order, ...orders]);
          clearCart();
          showToast('Order placed successfully!', 'success');
          return { success: true, order: data.order };
        } else {
          showToast(data.message || 'Error creating order', 'error');
          return { success: false, message: data.message };
        }
      } else {
        // Mock Order Creation
        const invoiceNumber = `INV-2026-${String(orders.length + 1).padStart(3, '0')}`;
        const totalSub = subtotal;
        const gst = Math.round(totalSub * 0.05);
        let shipping = 50;
        if (deliveryDetails.type === 'Midnight') shipping = 150;
        else if (deliveryDetails.type === 'Express') shipping = 100;

        const finalTotal = totalSub + gst + shipping - discountApplied;
        const advance = paymentMethod === 'COD' ? Math.round(finalTotal * 0.3) : finalTotal;
        const bal = paymentMethod === 'COD' ? finalTotal - advance : 0;

        const newOrder = {
          _id: `ord_${Math.random().toString(36).substring(7)}`,
          invoiceNumber,
          user: user._id,
          items: cart.map(({ cartItemId, ...item }) => ({ ...item, product: item.productId })),
          shippingAddress,
          deliveryDetails,
          payment: {
            method: paymentMethod,
            status: paymentMethod === 'COD' ? 'Partially Paid' : 'Paid',
            advancePaid: advance,
            balanceDue: bal,
            razorpayOrderId: paymentMethod !== 'COD' ? `rzp_order_mock_${Math.random().toString(36).substring(7)}` : undefined,
            transactionId: `tx_mock_${Math.random().toString(36).substring(5).toUpperCase()}`
          },
          pricing: {
            subtotal: totalSub,
            gstAmount: gst,
            shippingCharge: shipping,
            discountApplied,
            totalAmount: finalTotal
          },
          status: 'Confirmed',
          timeline: [
            { status: 'Confirmed', timestamp: new Date(), note: 'Order placed successfully (Demo Mode).' }
          ],
          createdAt: new Date()
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        localStorage.setItem('sweetcrave_orders', JSON.stringify(updatedOrders));
        clearCart();
        showToast('Demo order placed successfully!', 'success');
        return { success: true, order: newOrder };
      }
    } catch (err) {
      showToast('Error placing order', 'error');
      return { success: false, message: err.message };
    }
  };

  // USER CANCELLATION REQUEST
  const cancelOrder = async (orderId, reason) => {
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reason })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const updated = orders.map(o => o._id === orderId ? data.order : o);
          setOrders(updated);
          showToast('Order cancelled', 'info');
          return true;
        }
      } else {
        const updated = orders.map(o => {
          if (o._id === orderId) {
            return {
              ...o,
              status: 'Cancelled',
              payment: { ...o.payment, status: o.payment.status === 'Paid' ? 'Refunded' : o.payment.status },
              timeline: [...o.timeline, { status: 'Cancelled', timestamp: new Date(), note: `Cancelled by shopper. Reason: ${reason || 'N/A'}` }]
            };
          }
          return o;
        });
        setOrders(updated);
        localStorage.setItem('sweetcrave_orders', JSON.stringify(updated));
        showToast('Demo order cancelled', 'info');
        return true;
      }
    } catch (err) {
      showToast('Failed to cancel order', 'error');
    }
    return false;
  };

  // ADMIN OPERATIONS
  const addProduct = async (prod) => {
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/admin/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(prod)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts([data.product, ...products]);
          showToast('Product added successfully', 'success');
          return true;
        } else {
          showToast(data.message || 'Error adding product', 'error');
        }
      } else {
        const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newProduct = {
          _id: `prod_${Math.random().toString(36).substring(7)}`,
          slug,
          rating: 4.5,
          reviewsCount: 0,
          createdAt: new Date(),
          ...prod
        };
        const updatedProducts = [newProduct, ...products];
        setProducts(updatedProducts);
        localStorage.setItem('sweetcrave_products', JSON.stringify(updatedProducts));
        showToast('Product added to Demo store', 'success');
        return true;
      }
    } catch (err) {
      showToast('Error creating product', 'error');
    }
    return false;
  };

  const editProduct = async (prodId, updates) => {
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/admin/products/${prodId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updates)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts(products.map(p => p._id === prodId ? data.product : p));
          showToast('Product updated successfully', 'success');
          return true;
        }
      } else {
        const updatedProducts = products.map(p => p._id === prodId ? { ...p, ...updates } : p);
        setProducts(updatedProducts);
        localStorage.setItem('sweetcrave_products', JSON.stringify(updatedProducts));
        showToast('Product updated in Demo store', 'success');
        return true;
      }
    } catch (err) {
      showToast('Error updating product', 'error');
    }
    return false;
  };

  const deleteProduct = async (prodId) => {
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/admin/products/${prodId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts(products.filter(p => p._id !== prodId));
          showToast('Product deleted', 'info');
          return true;
        }
      } else {
        const updatedProducts = products.filter(p => p._id !== prodId);
        setProducts(updatedProducts);
        localStorage.setItem('sweetcrave_products', JSON.stringify(updatedProducts));
        showToast('Product deleted from Demo store', 'info');
        return true;
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
    return false;
  };

  const updateOrderStatus = async (orderId, nextStatus, timelineNote) => {
    try {
      if (isBackendOnline) {
        const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: nextStatus, note: timelineNote })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders(orders.map(o => o._id === orderId ? data.order : o));
          showToast(`Order status updated to ${nextStatus}`, 'success');
          return true;
        }
      } else {
        const updated = orders.map(o => {
          if (o._id === orderId) {
            const deliveryPaidUpdate = nextStatus === 'Delivered' ? { status: 'Paid', balanceDue: 0 } : o.payment;
            return {
              ...o,
              status: nextStatus,
              payment: { ...o.payment, ...deliveryPaidUpdate },
              timeline: [...o.timeline, { status: nextStatus, timestamp: new Date(), note: timelineNote || `Status updated to ${nextStatus}` }]
            };
          }
          return o;
        });
        setOrders(updated);
        localStorage.setItem('sweetcrave_orders', JSON.stringify(updated));
        showToast(`Demo order status updated to ${nextStatus}`, 'success');
        return true;
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      loading,
      products,
      categories,
      coupons,
      user,
      token,
      cart,
      wishlist,
      orders,
      reviews,
      selectedLocation,
      setSelectedLocation,
      searchQuery,
      setSearchQuery,
      theme,
      toggleTheme,
      toast,
      setToast,
      showToast,
      isBackendOnline,
      adminStats,
      fetchAdminStats,

      
      // auth
      login,
      register,
      loginWithGoogle,
      logout,
      addAddress,
      deleteAddress,

      // cart / wishlist
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      
      // transactions
      placeOrder,
      cancelOrder,

      // admin
      addProduct,
      editProduct,
      deleteProduct,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
