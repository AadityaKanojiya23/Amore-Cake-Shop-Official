import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';
import { getUsersStore, addUserStore } from '../config/mockStore.js';

// Helper to generate JWT 
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'sweetcrave_super_secret_jwt_key_123456789',
    { expiresIn: '30d' }
  ); 
}; 

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const dbStatus = getDBStatus();

    if (dbStatus.useMockData) {
      const users = getUsersStore();
      const userExists = users.find(u => u.email === email);

      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = addUserStore({
        name,
        email,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`
      });

      const token = generateToken(newUser._id, newUser.role);
      const { password: _, ...userResponse } = newUser;

      return res.status(201).json({
        success: true,
        token,
        user: userResponse
      });
    } else {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      });

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dbStatus = getDBStatus();

    if (dbStatus.useMockData) {
      const users = getUsersStore();
      const user = users.find(u => u.email === email);

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id, user.role);
        const { password: _, ...userResponse } = user;
        return res.json({
          success: true,
          token,
          user: userResponse
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role);
        return res.json({
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            addresses: user.addresses,
            wishlist: user.wishlist
          }
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google login (OAuth response receiver)
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  const { email, name, avatar, googleId } = req.body;

  try {
    const dbStatus = getDBStatus();

    if (dbStatus.useMockData) {
      const users = getUsersStore();
      let user = users.find(u => u.email === email);

      if (!user) {
        user = addUserStore({
          name,
          email,
          avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
          googleId // save optional identifier
        });
      }

      const token = generateToken(user._id, user.role);
      const { password: _, ...userResponse } = user;

      return res.json({
        success: true,
        token,
        user: userResponse
      });
    } else {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
        });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const { name, avatar } = req.body;

  try {
    const dbStatus = getDBStatus();

    if (dbStatus.useMockData) {
      const users = getUsersStore();
      const index = users.findIndex(u => u._id === req.user._id);

      if (index !== -1) {
        if (name) users[index].name = name;
        if (avatar) users[index].avatar = avatar;

        const { password: _, ...userResponse } = users[index];
        return res.json({ success: true, user: userResponse });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      const user = await User.findById(req.user._id);

      if (user) {
        if (name) user.name = name;
        if (avatar) user.avatar = avatar;

        const updatedUser = await user.save();
        return res.json({
          success: true,
          user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            addresses: updatedUser.addresses,
            wishlist: updatedUser.wishlist
          }
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = async (req, res) => {
  const { name, phone, street, city, state, zipCode, isDefault } = req.body;

  try {
    const dbStatus = getDBStatus();

    if (dbStatus.useMockData) {
      const users = getUsersStore();
      const user = users.find(u => u._id === req.user._id);

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (isDefault) {
        user.addresses.forEach(a => a.isDefault = false);
      }

      const newAddress = {
        _id: new mongoose.Types.ObjectId().toString(),
        name, phone, street, city, state, zipCode,
        isDefault: isDefault || user.addresses.length === 0
      };

      user.addresses.push(newAddress);
      return res.json({ success: true, addresses: user.addresses });
    } else {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (isDefault) {
        user.addresses.forEach(a => a.isDefault = false);
      }

      user.addresses.push({
        name, phone, street, city, state, zipCode,
        isDefault: isDefault || user.addresses.length === 0
      });

      await user.save();
      return res.json({ success: true, addresses: user.addresses });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  const addressId = req.params.id;

  try {
    const dbStatus = getDBStatus();

    if (dbStatus.useMockData) {
      const users = getUsersStore();
      const user = users.find(u => u._id === req.user._id);

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.addresses = user.addresses.filter(a => a._id !== addressId);
      // Set default to first if default was deleted
      if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
        user.addresses[0].isDefault = true;
      }

      return res.json({ success: true, addresses: user.addresses });
    } else {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.addresses = user.addresses.filter(a => a._id.toString() !== addressId);
      if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
        user.addresses[0].isDefault = true;
      }

      await user.save();
      return res.json({ success: true, addresses: user.addresses });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const dbStatus = getDBStatus();

    if (dbStatus.useMockData) {
      const users = getUsersStore();
      const user = users.find(u => u._id === req.user._id);

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const index = user.wishlist.indexOf(productId);
      if (index === -1) {
        user.wishlist.push(productId);
      } else {
        user.wishlist.splice(index, 1);
      }

      return res.json({ success: true, wishlist: user.wishlist });
    } else {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const prodIndex = user.wishlist.findIndex(id => id.toString() === productId);
      if (prodIndex === -1) {
        user.wishlist.push(productId);
      } else {
        user.wishlist.splice(prodIndex, 1);
      }

      await user.save();
      return res.json({ success: true, wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
