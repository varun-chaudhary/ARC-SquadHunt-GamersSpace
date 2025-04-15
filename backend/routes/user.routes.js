
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get all users (admin only)
router.get('/', authorize(['admin']), userController.getUsers);

router.get('/count-by-role',authorize(['admin']), userController.countByRole);

// Get user by ID (admin only)
router.get('/:id', authorize(['admin']), userController.getUserById);

// Delete user (admin only)
router.delete('/:id', authorize(['admin']), userController.deleteUser);



module.exports = router;
