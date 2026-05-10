import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  weight: { type: String, required: true },
  flavor: { type: String, required: true },
  isEggless: { type: Boolean, default: false },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  cakeMessage: { type: String, default: '' },
  addCandles: { type: Boolean, default: false },
  addFlowers: { type: Boolean, default: false },
  addChocolates: { type: Boolean, default: false }
});

const deliveryDetailsSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  timeSlot: { type: String, required: true }, // e.g. "Morning (9 AM - 12 PM)", "Standard (12 PM - 6 PM)", "Midnight (11 PM - 12 AM)"
  type: { type: String, enum: ['Standard', 'Midnight', 'Express'], default: 'Standard' }
});

const paymentDetailsSchema = new mongoose.Schema({
  method: { type: String, enum: ['COD', 'UPI', 'CARD'], required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded'], default: 'Pending' },
  advancePaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  transactionId: { type: String }
});

const orderTimelineSchema = new mongoose.Schema({
  status: { type: String, enum: ['Confirmed', 'Baking', 'Packed', 'Out for delivery', 'Delivered', 'Cancelled'], required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  deliveryDetails: deliveryDetailsSchema,
  payment: paymentDetailsSchema,
  pricing: {
    subtotal: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    shippingCharge: { type: Number, required: true },
    discountApplied: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Baking', 'Packed', 'Out for delivery', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  },
  timeline: [orderTimelineSchema],
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
