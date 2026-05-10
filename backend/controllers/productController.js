import Product from '../models/Product.js';
import { getDBStatus } from '../config/db.js';
import { getProductsStore, getCategoriesStore } from '../config/mockStore.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, rating, sort, limit = 100, page = 1 } = req.query;
    const dbStatus = getDBStatus();

    let productsList = [];

    if (dbStatus.useMockData) {
      productsList = getProductsStore();
    } else {
      productsList = await Product.find({});
    }

    // Apply filters in-memory (or DB queries can be built, but doing it in code is 100% consistent across both environments!)
    let filtered = [...productsList];

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (minPrice) {
      filtered = filtered.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
    }

    if (rating) {
      filtered = filtered.filter(p => p.rating >= Number(rating));
    }

    // Sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    res.json({
      success: true,
      count: filtered.length,
      pages: Math.ceil(filtered.length / Number(limit)),
      currentPage: Number(page),
      products: paginated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const dbStatus = getDBStatus();
    let product;

    if (dbStatus.useMockData) {
      product = getProductsStore().find(p => p.slug === slug);
    } else {
      product = await Product.findOne({ slug });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get homepage promo product list
// @route   GET /api/products/homepage/promos
// @access  Public
export const getHomepageProducts = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    let list = [];

    if (dbStatus.useMockData) {
      list = getProductsStore();
    } else {
      list = await Product.find({});
    }

    const featured = list.filter(p => p.isFeatured).slice(0, 10);
    const bestSellers = list.filter(p => p.isBestSeller).slice(0, 10);
    const trending = list.filter(p => p.isTrending).slice(0, 10);
    const premium = list.filter(p => p.isPremium).slice(0, 10);
    
    // Quick categories lists
    const chocolateHeaven = list.filter(p => p.category === 'chocolate-cakes').slice(0, 8);
    const cupcakes = list.filter(p => p.category === 'cupcakes').slice(0, 8);
    const pastries = list.filter(p => p.category === 'pastries').slice(0, 8);

    res.json({
      success: true,
      featured,
      bestSellers,
      trending,
      premium,
      categories: {
        chocolateHeaven,
        cupcakes,
        pastries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get similar products
// @route   GET /api/products/:slug/similar
// @access  Public
export const getSimilarProducts = async (req, res) => {
  const { slug } = req.params;

  try {
    const dbStatus = getDBStatus();
    let list = [];

    if (dbStatus.useMockData) {
      list = getProductsStore();
    } else {
      list = await Product.find({});
    }

    const product = list.find(p => p.slug === slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const similar = list
      .filter(p => p.category === product.category && p._id.toString() !== product._id.toString())
      .slice(0, 4);

    res.json({ success: true, similar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get categories
// @route   GET /api/products/categories/list
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const cats = getCategoriesStore(); // returns categories array static list
    res.json({ success: true, categories: cats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
