// server/routes/followRoutes.js
const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Follow/unfollow
router.post('/:id', async (req, res) => {
  try {
    const currentUserId = req.body.userId;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
      return res.json({ action: 'unfollow' });
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
      return res.json({ action: 'follow' });
    }
  } catch (error) {
    console.error('Follow error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get follower stats
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('followers following');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      followers: user.followers.length,
      following: user.following.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;