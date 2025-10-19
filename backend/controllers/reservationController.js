const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
const getReservations = async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const skip = (page - 1) * limit;

    const reservations = await Reservation.find()
      .sort({ checkIn: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Reservation.countDocuments();

    res.json({
      success: true,
      count: reservations.length,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reservations for a specific catway
// @route   GET /api/catways/:id/reservations
// @access  Public
const getCatwayReservations = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    const reservations = await Reservation.find({ 
      catwayNumber: catway.catwayNumber 
    }).sort({ checkIn: 1 });

    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/catways/:id/reservations/:reservationId
// @access  Public
const getReservation = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    const reservation = await Reservation.findOne({
      _id: req.params.reservationId,
      catwayNumber: catway.catwayNumber
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create reservation
// @route   POST /api/catways/:id/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    // Vérifier la disponibilité du catway
    const existingReservation = await Reservation.findOne({
      catwayNumber: catway.catwayNumber,
      status: 'active',
      $or: [
        { checkIn: { $lt: req.body.checkOut }, checkOut: { $gt: req.body.checkIn } }
      ]
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'Ce catway est déjà réservé pour cette période'
      });
    }

    const reservation = await Reservation.create({
      ...req.body,
      catwayNumber: catway.catwayNumber
    });

    // Mettre à jour la disponibilité du catway si nécessaire
    await Catway.findOneAndUpdate(
      { catwayNumber: catway.catwayNumber },
      { isAvailable: false }
    );

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update reservation
// @route   PUT /api/catways/:id/reservations/:reservationId
// @access  Private
const updateReservation = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    const reservation = await Reservation.findOneAndUpdate(
      {
        _id: req.params.reservationId,
        catwayNumber: catway.catwayNumber
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/catways/:id/reservations/:reservationId
// @access  Private
const deleteReservation = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    const reservation = await Reservation.findOneAndDelete({
      _id: req.params.reservationId,
      catwayNumber: catway.catwayNumber
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier s'il reste des réservations actives pour ce catway
    const activeReservations = await Reservation.countDocuments({
      catwayNumber: catway.catwayNumber,
      status: 'active'
    });

    if (activeReservations === 0) {
      await Catway.findOneAndUpdate(
        { catwayNumber: catway.catwayNumber },
        { isAvailable: true }
      );
    }

    res.json({
      success: true,
      message: 'Réservation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getReservations,
  getCatwayReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation
};