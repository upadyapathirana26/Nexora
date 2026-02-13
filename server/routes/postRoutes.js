// server/routes/postRoutes.js
const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const upload = require('../middleware/upload');

const router = express.Router();

// @desc    Create a new post
// @route   POST /api/posts
// @access  Public (for now — we'll add auth later)


// POST route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mediaUrls = [];
    if (req.file) {
      mediaUrls.push(req.file.path); // Cloudinary URL
    }

    const post = new Post({
      userId,
      content: content || '',
      mediaUrls,
      likes: [],
      comments: [],
    });

    await post.save();
    const populatedPost = await Post.findById(post._id).populate('userId', 'name');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all posts (for feed)
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20); // Get latest 20 posts

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;