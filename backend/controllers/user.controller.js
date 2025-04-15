
const User = require('../models/user.model');

// Get all users with pagination
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const query = { isDeleted: false };
    
    // Filter by role if provided
    if (role) {
      query.role = role;
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }
    };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .select('-password');

    res.json({
      data: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isDeleted: user.isDeleted,
        deletedAt: user.deletedAt,
        createdAt: user.createdAt
      })),
      meta: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false })
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.countByRole = async (req, res) => {
    try {
      const counts = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);
  
      res.json(counts);
    } catch (err) {
      console.error('Error fetching user counts by role:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }