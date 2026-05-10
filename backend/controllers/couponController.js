import Coupon from '../models/Coupon.js';
import { getDBStatus } from '../config/db.js';
import { getCouponsStore } from '../config/mockStore.js';

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  const { code, purchaseAmount } = req.body;

  try {
    const dbStatus = getDBStatus();
    let coupon;

    if (dbStatus.useMockData) {
      coupon = getCouponsStore().find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    } else {
      coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    // Check minimum purchase limit
    if (purchaseAmount < coupon.minPurchase) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of ₹${coupon.minPurchase} required to use this coupon` 
      });
    }

    // Calculate discount deduction
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (purchaseAmount * coupon.discountAmount) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountAmount;
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        calculatedDiscount: Math.round(discount)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
export const getCoupons = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    let list = [];

    if (dbStatus.useMockData) {
      list = getCouponsStore().filter(c => c.isActive);
    } else {
      list = await Coupon.find({ isActive: true });
    }

    res.json({ success: true, coupons: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
