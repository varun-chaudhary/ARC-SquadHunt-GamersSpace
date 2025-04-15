
const Opportunity = require('../models/opportunity.model');
const User = require('../models/user.model');

// Get all opportunities with pagination
exports.getOpportunities = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }
    };

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
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOpportunityCount = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const count = await Opportunity.countDocuments(query);
    res.json({ count });
  } catch (error) {
    console.error('Error counting opportunities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get opportunity by ID
exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('organizerId', 'name email role');
    
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json({
      id: opportunity._id,
      title: opportunity.title,
      description: opportunity.description,
      location: opportunity.location,
      eventDate: opportunity.eventDate,
      capacity: opportunity.capacity,
      organizerId: opportunity.organizerId._id,
      organizer: {
        id: opportunity.organizerId._id,
        name: opportunity.organizerId.name,
        email: opportunity.organizerId.email,
        role: opportunity.organizerId.role,
        status: 'active',
        isDeleted: false,
        createdAt: opportunity.createdAt
      },
      status: opportunity.status,
      createdAt: opportunity.createdAt,
      updatedAt: opportunity.updatedAt
    });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new opportunity
exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, location, eventDate, capacity, organizerId } = req.body;
    
    const opportunity = new Opportunity({
      title,
      description,
      location,
      eventDate,
      capacity,
      organizerId: organizerId || req.user._id,
      status: 'pending'
    });

    await opportunity.save();
    
    // Fetch organizer data for response
    const organizer = await User.findById(opportunity.organizerId);

    res.status(201).json({
      id: opportunity._id,
      title: opportunity.title,
      description: opportunity.description,
      location: opportunity.location,
      eventDate: opportunity.eventDate,
      capacity: opportunity.capacity,
      organizerId: opportunity.organizerId,
      organizer: organizer ? {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        role: organizer.role,
        status: 'active',
        isDeleted: false,
        createdAt: organizer.createdAt
      } : null,
      status: opportunity.status,
      createdAt: opportunity.createdAt,
      updatedAt: opportunity.updatedAt
    });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update opportunity status
exports.updateOpportunityStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    opportunity.status = status;
    await opportunity.save();

    res.json({ message: 'Opportunity status updated successfully' });
  } catch (error) {
    console.error('Error updating opportunity status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
