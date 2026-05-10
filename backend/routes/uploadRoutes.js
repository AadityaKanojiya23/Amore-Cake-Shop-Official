import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB maximum file size
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    // Verify Cloudinary credentials are mock/not set
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud') {
      console.log('☁️ Mock Image Upload Mode active. Returning a beautiful fallback image URL!');
      return res.json({
        success: true,
        message: 'Image uploaded successfully (Mock Mode fallback)',
        url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'
      });
    }

    // Convert image buffer to base64 format for Cloudinary upload API
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload direct to Cloudinary bucket
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'sweetcrave_products',
      resource_type: 'auto'
    });

    return res.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('☁️ Cloudinary Upload Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
