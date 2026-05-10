import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';
import { getUsersStore } from '../config/mockStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sweetcrave_super_secret_jwt_key_123456789');

      const dbStatus = getDBStatus();
      if (dbStatus.useMockData) {
        // Fallback to mock store
        const users = getUsersStore();
        const user = users.find(u => u._id === decoded.id);
        if (!user) {
          return res.status(401).json({ success: false, message: 'Not authorized, mock user not found' });
        }
        // Exclude password
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      } else {
        // Real DB
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
      }

      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied, admin privilege required' });
  }
};
