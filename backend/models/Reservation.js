const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est obligatoire'],
    ref: 'Catway'
  },
  clientName: {
    type: String,
    required: [true, 'Le nom du client est obligatoire'],
    trim: true
  },
  boatName: {
    type: String,
    required: [true, 'Le nom du bateau est obligatoire'],
    trim: true
  },
  checkIn: {
    type: Date,
    required: [true, 'La date de début est obligatoire'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'La date de début doit être dans le futur'
    }
  },
  checkOut: {
    type: Date,
    required: [true, 'La date de fin est obligatoire'],
    validate: {
      validator: function(date) {
        return date > this.checkIn;
      },
      message: 'La date de fin doit être après la date de début'
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Validation : pas de chevauchement de réservations pour un même catway
reservationSchema.index({ catwayNumber: 1, checkIn: 1, checkOut: 1 });

// Middleware pour vérifier la disponibilité avant sauvegarde
reservationSchema.pre('save', async function(next) {
  const overlappingReservation = await mongoose.model('Reservation').findOne({
    catwayNumber: this.catwayNumber,
    _id: { $ne: this._id },
    status: 'active',
    $or: [
      { checkIn: { $lt: this.checkOut }, checkOut: { $gt: this.checkIn } }
    ]
  });

  if (overlappingReservation) {
    const err = new Error('Ce catway est déjà réservé pour cette période');
    err.statusCode = 400;
    return next(err);
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);