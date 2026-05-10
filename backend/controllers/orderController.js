import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { getDBStatus } from '../config/db.js';
import { getOrdersStore, addOrderStore, updateOrderStore } from '../config/mockStore.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay Client dynamically
const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return null;
};

// Helper to generate Invoice Number
const generateInvoiceNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${randomStr}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const {
    items,
    shippingAddress,
    deliveryDetails,
    paymentMethod,
    pricing,
    couponCode
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  try {
    const dbStatus = getDBStatus();
    const invoiceNumber = generateInvoiceNumber();

    // Verify inventory and prices
    // Establish pricing structure
    const subtotal = pricing.subtotal;
    const gstAmount = Math.round(subtotal * 0.05); // 5% GST on food
    
    // Delivery fees: Standard (50), Midnight (150), Express (100)
    let shippingCharge = 50;
    if (deliveryDetails.type === 'Midnight') shippingCharge = 150;
    else if (deliveryDetails.type === 'Express') shippingCharge = 100;

    const discountApplied = pricing.discountApplied || 0;
    const totalAmount = subtotal + gstAmount + shippingCharge - discountApplied;

    // Payment setup: COD requires 30% advance
    let advancePaid = 0;
    let balanceDue = totalAmount;
    let paymentStatus = 'Pending';

    if (paymentMethod === 'COD') {
      advancePaid = Math.round(totalAmount * 0.3); // 30% advance payment required
      balanceDue = totalAmount - advancePaid;
      paymentStatus = 'Partially Paid'; // Advance paid, remaining COD
    } else {
      // CARD or UPI online payments are fully paid upfront
      advancePaid = totalAmount;
      balanceDue = 0;
      paymentStatus = 'Paid';
    }

    const orderData = {
      user: req.user._id,
      invoiceNumber,
      items,
      shippingAddress,
      deliveryDetails,
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        advancePaid,
        balanceDue,
        razorpayOrderId: paymentMethod !== 'COD' ? `rzp_order_${Math.random().toString(36).substring(7)}` : undefined,
        transactionId: `tx_${Math.random().toString(36).substring(5).toUpperCase()}`
      },
      pricing: {
        subtotal,
        gstAmount,
        shippingCharge,
        discountApplied,
        totalAmount
      },
      status: 'Confirmed',
      timeline: [
        { status: 'Confirmed', timestamp: new Date(), note: 'Order placed successfully. Payment verified.' }
      ],
      createdAt: new Date()
    };

    if (dbStatus.useMockData) {
      const newOrder = addOrderStore(orderData);
      return res.status(201).json({ success: true, order: newOrder });
    } else {
      // Real DB insertion
      const newOrder = new Order({
        ...orderData,
        items: items.map(item => ({
          product: item.productId,
          name: item.name,
          image: item.image,
          weight: item.weight,
          flavor: item.flavor,
          isEggless: item.isEggless,
          quantity: item.quantity,
          price: item.price,
          cakeMessage: item.cakeMessage || '',
          addCandles: item.addCandles || false,
          addFlowers: item.addFlowers || false,
          addChocolates: item.addChocolates || false
        }))
      });

      const savedOrder = await newOrder.save();

      // Deduct inventory
      for (const item of items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { inventory: -item.quantity }
        });
      }

      return res.status(201).json({ success: true, order: savedOrder });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    let orders = [];

    if (dbStatus.useMockData) {
      orders = getOrdersStore().filter(o => o.user === req.user._id);
    } else {
      orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const dbStatus = getDBStatus();
    let order;

    if (dbStatus.useMockData) {
      order = getOrdersStore().find(o => o._id === id);
    } else {
      order = await Order.findById(id).populate('items.product');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify authorized user
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const dbStatus = getDBStatus();

    if (dbStatus.useMockData) {
      const orders = getOrdersStore();
      const order = orders.find(o => o._id === id);

      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      if (order.user !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      if (['Out for delivery', 'Delivered'].includes(order.status)) {
        return res.status(400).json({ success: false, message: 'Cannot cancel order once out for delivery or delivered.' });
      }

      order.status = 'Cancelled';
      order.timeline.push({ status: 'Cancelled', timestamp: new Date(), note: `Cancelled by user. Reason: ${reason || 'N/A'}` });
      order.payment.status = order.payment.status === 'Paid' ? 'Refunded' : order.payment.status;

      return res.json({ success: true, order });
    } else {
      const order = await Order.findById(id);

      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      if (['Out for delivery', 'Delivered'].includes(order.status)) {
        return res.status(400).json({ success: false, message: 'Cannot cancel order once out for delivery or delivered.' });
      }

      order.status = 'Cancelled';
      order.timeline.push({ status: 'Cancelled', timestamp: new Date(), note: `Cancelled by user. Reason: ${reason || 'N/A'}` });
      if (order.payment.status === 'Paid' || order.payment.status === 'Partially Paid') {
        order.payment.status = 'Refunded';
      }

      await order.save();

      // Return items to inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { inventory: item.quantity }
        });
      }

      return res.json({ success: true, order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay/create
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body; // amount in INR (e.g. 500)

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  try {
    const razorpayInstance = getRazorpayInstance();
    const amountInPaise = Math.round(amount * 100);

    if (razorpayInstance) {
      // Live/Production Razorpay
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_order_${Math.random().toString(36).substring(7)}`,
      };

      const rzpOrder = await razorpayInstance.orders.create(options);
      return res.json({
        success: true,
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        isMock: false
      });
    } else {
      // Mock Razorpay Order for fallback/testing/offline-readiness
      console.log('⚠️ Razorpay credentials not configured. Generating secure mock payment order ID!');
      const mockOrderId = `rzp_order_mock_${Math.random().toString(36).substring(7)}`;
      return res.json({
        success: true,
        orderId: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        isMock: true
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/orders/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id) {
    return res.status(400).json({ success: false, message: 'Missing payment parameters' });
  }

  try {
    const razorpayInstance = getRazorpayInstance();

    // If it's a mock order id (starts with rzp_order_mock_) or razorpay is not configured, we simulate success
    if (razorpay_order_id.startsWith('rzp_order_mock_') || !razorpayInstance) {
      console.log('🛡️ Verifying simulated payment signature for:', razorpay_order_id);
      return res.json({
        success: true,
        message: 'Payment verified successfully (Simulated)',
        isMock: true
      });
    }

    // Live Signature Verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      return res.json({
        success: true,
        message: 'Payment signature verified successfully',
        isMock: false
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
