const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
      type: String,
  },
  moderator: {
    type: String,
    ref: 'User',
  },
  category: {
    type: String,
  },
  sub_category: {
    type: String,
  },
  rigor_rank: {
    type: Number,
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {timestamps: true});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
