
const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get all opportunities (accessible to all authenticated users)
router.get('/', authorize(['admin', 'organizer', 'player']), opportunityController.getOpportunities);

router.get('/counts', authorize(['admin']), opportunityController.getOpportunityCount);

// Get opportunity by ID
router.get('/:id', authorize(['admin', 'organizer', 'player']), opportunityController.getOpportunityById);

// Create new opportunity (organizers only)
router.post('/', authorize(['organizer']), opportunityController.createOpportunity);

// Update opportunity status (admin only)
router.patch('/:id/status', authorize(['admin']), opportunityController.updateOpportunityStatus);

module.exports = router;
