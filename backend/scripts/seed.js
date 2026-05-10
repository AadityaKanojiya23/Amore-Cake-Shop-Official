import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Review from '../models/Review.js';

// Import our pre-configured lists from mockStore
import { 
  categories, 
  coupons, 
  generateProducts, 
  mockUsers, 
  mockReviews 
} from '../config/mockStore.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sweetcrave';
    console.log(`Connecting to MongoDB at: ${mongoUri} for seeding...`);
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully!');

    // Clean existing data
    console.log('Cleaning collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});
    console.log('Collections cleared.');

    // Seed Categories
    console.log('Seeding categories...');
    await Category.insertMany(categories);
    console.log(`Seeded ${categories.length} categories.`);

    // Seed Coupons
    console.log('Seeding coupons...');
    await Coupon.insertMany(coupons.map(({ _id, ...c }) => c)); // Strip hardcoded mock _ids for autogeneration
    console.log(`Seeded ${coupons.length} coupons.`);

    // Seed Users
    console.log('Seeding users...');
    const usersToInsert = mockUsers.map(({ _id, ...u }) => ({
      ...u,
      addresses: u.addresses.map(({ _id: addrId, ...addr }) => addr)
    }));
    const createdUsers = await User.insertMany(usersToInsert);
    console.log(`Seeded ${createdUsers.length} users (including user & admin).`);

    const standardUser = createdUsers.find(u => u.role === 'user');

    // Seed Products (100+ cakes, decor, combinations)
    console.log('Generating and seeding products...');
    const rawProducts = generateProducts();
    // Strip generated _ids so MongoDB generates pure ObjectIds
    const productsToInsert = rawProducts.map(({ _id, ...p }) => p);
    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`Seeded ${createdProducts.length} high-quality products across all categories!`);

    // Seed Reviews
    console.log('Seeding product reviews...');
    const reviewsToInsert = mockReviews.map((r) => {
      // Find a matched product in database to link the review
      const randProd = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      return {
        product: randProd._id,
        user: standardUser._id,
        userName: standardUser.name,
        userAvatar: standardUser.avatar,
        rating: r.rating,
        comment: r.comment,
        isApproved: r.isApproved,
        createdAt: r.createdAt
      };
    });
    
    await Review.insertMany(reviewsToInsert);
    console.log(`Seeded reviews successfully.`);

    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY! Database is fully populated with 100+ products and demo profiles.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed with error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
