
const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  eventDate: {
    type: Date,
    required: false
  },
  capacity: {
    type: Number,
    required: false
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'closed'],
    default: 'pending'
  },
  registeredPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  joinedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
