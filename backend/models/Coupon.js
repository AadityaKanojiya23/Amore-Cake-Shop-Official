import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountAmount: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  maxDiscount: { type: Number }, // For percentage-based discounts
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 }
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
