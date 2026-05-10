import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';
import { 
  getProductsStore, getOrdersStore, getUsersStore, 
  addProductStore, updateProductStore, deleteProductStore, updateOrderStore 
} from '../config/mockStore.js';

// @desc    Get Admin Panel Dashboard Analytics (Total Sales, Order Status Counts, Category Sales, Low Inventory)
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    let orders = [];
    let products = [];
    let users = [];

    if (dbStatus.useMockData) {
      orders = getOrdersStore();
      products = getProductsStore();
      users = getUsersStore();
    } else {
      orders = await Order.find({});
      products = await Product.find({});
      users = await User.find({});
    }

    // Calculations
    const completedOrders = orders.filter(o => o.status === 'Delivered');
    const totalSales = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.pricing.totalAmount, 0);

    const pendingOrdersCount = orders.filter(o => ['Confirmed', 'Baking', 'Packed', 'Out for delivery'].includes(o.status)).length;
    const deliveredCount = completedOrders.length;
    const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

    // Sales by Category
    const salesByCategory = {};
    orders.filter(o => o.status !== 'Cancelled').forEach(o => {
      o.items.forEach(item => {
        // Find category from item
        const prod = products.find(p => p._id.toString() === (item.product?._id || item.product).toString());
        const cat = prod ? prod.category : 'other';
        salesByCategory[cat] = (salesByCategory[cat] || 0) + (item.price * item.quantity);
      });
    });

    const lowInventoryProducts = products.filter(p => p.inventory < 10).map(p => ({
      _id: p._id,
      name: p.name,
      inventory: p.inventory,
      slug: p.slug
    }));

    res.json({
      success: true,
      summary: {
        totalSales,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrdersCount,
        deliveredCount,
        cancelledCount,
        averageOrderValue: orders.length > 0 ? Math.round(totalSales / orders.length) : 0
      },
      salesByCategory,
      lowInventory: lowInventoryProducts,
      recentOrders: orders.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin list)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    let orders = [];

    if (dbStatus.useMockData) {
      orders = getOrdersStore();
    } else {
      orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status timeline (Admin control)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  try {
    const dbStatus = getDBStatus();
    let updatedOrder;

    if (dbStatus.useMockData) {
      updatedOrder = updateOrderStore(id, status, note || `Order status updated to: ${status}`);
    } else {
      const order = await Order.findById(id);
      if (order) {
        order.status = status;
        order.timeline.push({
          status,
          timestamp: new Date(),
          note: note || `Order status updated to: ${status}`
        });

        if (status === 'Delivered') {
          order.payment.status = 'Paid';
          order.payment.balanceDue = 0;
        }

        updatedOrder = await order.save();
      }
    }

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
export const addProduct = async (req, res) => {
  const {
    name, category, description, longDescription, ingredients,
    images, price, discountPrice, weights, flavors, isEgglessOption,
    isFeatured, isPremium, isTrending, isBestSeller, inventory, tags
  } = req.body;

  try {
    const dbStatus = getDBStatus();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const productData = {
      name, slug, category, description, longDescription, ingredients,
      images: images || ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'],
      price, discountPrice, weights, flavors, isEgglessOption,
      isFeatured, isPremium, isTrending, isBestSeller, inventory: inventory || 50, tags
    };

    if (dbStatus.useMockData) {
      const newProduct = addProductStore(productData);
      return res.status(201).json({ success: true, product: newProduct });
    } else {
      const exists = await Product.findOne({ slug });
      if (exists) return res.status(400).json({ success: false, message: 'Product with this name already exists' });

      const newProduct = await Product.create(productData);
      return res.status(201).json({ success: true, product: newProduct });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Edit product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const editProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const dbStatus = getDBStatus();
    let updated;

    if (dbStatus.useMockData) {
      updated = updateProductStore(id, req.body);
    } else {
      updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const dbStatus = getDBStatus();
    let deleted;

    if (dbStatus.useMockData) {
      deleted = deleteProductStore(id);
    } else {
      deleted = await Product.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully', product: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (Admin view)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    let users = [];

    if (dbStatus.useMockData) {
      users = getUsersStore();
    } else {
      users = await User.find({}).select('-password');
    }

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
