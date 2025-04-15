
const Opportunity = require('../models/opportunity.model');
const User = require('../models/user.model');

// Get opportunities that a player has registered for
exports.getPlayerOpportunities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const playerId = req.params.playerId;
    
    // Verify this is a valid player
    const player = await User.findOne({ _id: playerId, role: 'player' });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }
    };

    // Find opportunities that this player has registered for
    const query = { registeredPlayers: playerId, status: 'approved' };
    const total = await Opportunity.countDocuments(query);
    const opportunities = await Opportunity.find(query)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .populate('organizerId', 'name email role');

    res.json({
      data: opportunities.map(opp => ({
        id: opp._id,
        title: opp.title,
        description: opp.description,
        location: opp.location,
        eventDate: opp.eventDate,
        capacity: opp.capacity,
        organizerId: opp.organizerId._id,
        organizer: {
          id: opp.organizerId._id,
          name: opp.organizerId.name,
          email: opp.organizerId.email,
          role: opp.organizerId.role,
          status: 'active',
          isDeleted: false,
          createdAt: opp.createdAt
        },
        status: opp.status,
        createdAt: opp.createdAt,
        updatedAt: opp.updatedAt
      })),
      meta: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching player opportunities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get opportunities that a player has joined
exports.getPlayerJoinedOpportunities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const playerId = req.params.playerId;
    
    // Verify this is a valid player
    const player = await User.findOne({ _id: playerId, role: 'player' });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }
    };

    // Find opportunities that this player has joined
    const query = { joinedPlayers: playerId, status: 'approved' };
    const total = await Opportunity.countDocuments(query);
    const opportunities = await Opportunity.find(query)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .populate('organizerId', 'name email role');

    res.json({
      data: opportunities.map(opp => ({
        id: opp._id,
        title: opp.title,
        description: opp.description,
        location: opp.location,
        eventDate: opp.eventDate,
        capacity: opp.capacity,
        organizerId: opp.organizerId._id,
        organizer: {
          id: opp.organizerId._id,
          name: opp.organizerId.name,
          email: opp.organizerId.email,
          role: opp.organizerId.role,
          status: 'active',
          isDeleted: false,
          createdAt: opp.createdAt
        },
        status: opp.status,
        createdAt: opp.createdAt,
        updatedAt: opp.updatedAt
      })),
      meta: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching player joined opportunities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register player for an opportunity
exports.registerForOpportunity = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const opportunityId = req.params.opportunityId;
    
    // Verify player
    const player = await User.findOne({ _id: playerId, role: 'player' });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Verify opportunity
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.status !== 'approved') {
      return res.status(400).json({ message: 'Can only register for approved opportunities' });
    }

    // Check if already registered
    if (opportunity.registeredPlayers.includes(playerId)) {
      return res.status(400).json({ message: 'Player already registered for this opportunity' });
    }

    // Add player to registeredPlayers
    opportunity.registeredPlayers.push(playerId);
    await opportunity.save();

    res.json({ message: 'Successfully registered for opportunity' });
  } catch (error) {
    console.error('Error registering for opportunity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Join an opportunity (mark as joined)
exports.joinOpportunity = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const opportunityId = req.params.opportunityId;
    
    // Verify player
    const player = await User.findOne({ _id: playerId, role: 'player' });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Verify opportunity
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.status !== 'approved') {
      return res.status(400).json({ message: 'Can only join approved opportunities' });
    }

    // Check if already joined
    if (opportunity.joinedPlayers.includes(playerId)) {
      return res.status(400).json({ message: 'Player already joined this opportunity' });
    }

    // Add player to joinedPlayers
    opportunity.joinedPlayers.push(playerId);
    await opportunity.save();

    res.json({ message: 'Successfully joined opportunity' });
  } catch (error) {
    console.error('Error joining opportunity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats for a player
exports.getPlayerDashboardStats = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    
    // Verify this is a valid player
    const player = await User.findOne({ _id: playerId, role: 'player' });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Count registered opportunities
    const registeredOpportunities = await Opportunity.countDocuments({ 
      registeredPlayers: playerId 
    });
    
    // Count upcoming and past opportunities
    const now = new Date();
    const upcomingOpportunities = await Opportunity.countDocuments({ 
      registeredPlayers: playerId,
      eventDate: { $gt: now }
    });
    
    const pastOpportunities = await Opportunity.countDocuments({ 
      registeredPlayers: playerId,
      eventDate: { $lt: now }
    });
    
    // Get recently registered opportunities
    const recentlyRegistered = await Opportunity.find({ registeredPlayers: playerId })
      .sort({ _id: -1 })
      .limit(3)
      .select('_id title eventDate location');

    res.json({
      registeredOpportunities,
      upcomingOpportunities,
      pastOpportunities,
      recentlyRegistered: recentlyRegistered.map(opp => ({
        id: opp._id,
        title: opp.title,
        eventDate: opp.eventDate,
        location: opp.location
      }))
    });
  } catch (error) {
    console.error('Error fetching player dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
