
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const { authorize } = require('../middleware/auth.middleware');

// Get opportunities that a player has registered for
router.get('/:playerId/opportunities', authorize(['admin', 'player']), playerController.getPlayerOpportunities);

// Get opportunities that a player has joined
router.get('/:playerId/joined-opportunities', authorize(['admin', 'player']), playerController.getPlayerJoinedOpportunities);

// Register for an opportunity
router.post('/:playerId/opportunities/:opportunityId/register', authorize(['player']), playerController.registerForOpportunity);

// Join an opportunity
router.post('/:playerId/opportunities/:opportunityId/join', authorize(['player']), playerController.joinOpportunity);

// Get dashboard stats for a player
router.get('/:playerId/dashboard-stats', authorize(['admin', 'player']), playerController.getPlayerDashboardStats);

module.exports = router;
