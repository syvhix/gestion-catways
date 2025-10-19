const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est obligatoire'],
    unique: true,
    min: 1
  },
  type: {
    type: String,
    required: [true, 'Le type est obligatoire'],
    enum: {
      values: ['long', 'short'],
      message: 'Le type doit être "long" ou "short"'
    }
  },
  catwayState: {
    type: String,
    required: [true, 'L\'état du catway est obligatoire'],
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
catwaySchema.index({ catwayNumber: 1 });
catwaySchema.index({ type: 1, isAvailable: 1 });

module.exports = mongoose.model('Catway', catwaySchema);