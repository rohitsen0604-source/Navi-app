const mongoose = require('mongoose');

const riverLakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    default: 'Varanasi'
  },
  state: {
    type: String,
    required: true,
    default: 'Uttar Pradesh'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RiverLake', riverLakeSchema);
