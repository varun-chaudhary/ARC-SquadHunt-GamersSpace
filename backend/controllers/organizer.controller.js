
const Opportunity = require('../models/opportunity.model');
const User = require('../models/user.model');

// Get opportunities for a specific organizer
exports.getOrganizerOpportunities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const organizerId = req.params.organizerId;
    
    // Verify this is a valid organizer
    const organizer = await User.findOne({ _id: organizerId, role: 'organizer' });
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }
    };

    const query = { organizerId };
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
    console.error('Error fetching organizer opportunities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats for organizer
exports.getOrganizerDashboardStats = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;
    
    // Verify this is a valid organizer
    const organizer = await User.findOne({ _id: organizerId, role: 'organizer' });
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Count opportunities by status
    const totalOpportunities = await Opportunity.countDocuments({ organizerId });
    const pendingOpportunities = await Opportunity.countDocuments({ organizerId, status: 'pending' });
    const approvedOpportunities = await Opportunity.countDocuments({ organizerId, status: 'approved' });
    const closedOpportunities = await Opportunity.countDocuments({ organizerId, status: 'closed' });

    // Get recent opportunities
    const recentOpportunities = await Opportunity.find({ organizerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id title status createdAt');

    res.json({
      totalOpportunities,
      pendingOpportunities,
      approvedOpportunities,
      closedOpportunities,
      recentOpportunities: recentOpportunities.map(opp => ({
        id: opp._id,
        title: opp.title,
        status: opp.status,
        createdAt: opp.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching organizer dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
