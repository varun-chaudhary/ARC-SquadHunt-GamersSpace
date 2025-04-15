
const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizer.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get opportunities for a specific organizer
router.get('/:organizerId/opportunities', authorize(['admin', 'organizer']), organizerController.getOrganizerOpportunities);

// Get dashboard stats for organizer
router.get('/:organizerId/dashboard-stats', authorize(['admin', 'organizer']), organizerController.getOrganizerDashboardStats);

module.exports = router;
