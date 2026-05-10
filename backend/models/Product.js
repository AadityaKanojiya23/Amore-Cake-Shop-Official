import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // slug of category
  description: { type: String, required: true },
  longDescription: { type: String },
  ingredients: [{ type: String }],
  images: [{ type: String, required: true }],
  price: { type: Number, required: true }, // Base price for 0.5kg
  discountPrice: { type: Number }, // Promotional discounted price
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  inventory: { type: Number, default: 50 },
  weights: [{ type: String, default: ['0.5kg', '1.0kg', '1.5kg', '2.0kg'] }],
  flavors: [{ type: String, default: ['Standard Chocolate', 'Red Velvet', 'Vanilla Bean', 'Black Forest', 'Butterscotch'] }],
  isEgglessOption: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
