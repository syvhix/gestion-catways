const Catway = require('../models/Catway');

// @desc    Get all catways
// @route   GET /api/catways
// @access  Public
const getCatways = async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const skip = (page - 1) * limit;

    const catways = await Catway.find()
      .sort({ catwayNumber: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Catway.countDocuments();

    res.json({
      success: true,
      count: catways.length,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: catways
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single catway
// @route   GET /api/catways/:id
// @access  Public
const getCatway = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    res.json({
      success: true,
      data: catway
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create catway
// @route   POST /api/catways
// @access  Private
const createCatway = async (req, res) => {
  try {
    const catway = await Catway.create(req.body);
    
    res.status(201).json({
      success: true,
      data: catway
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un catway avec ce numéro existe déjà'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update catway
// @route   PUT /api/catways/:id
// @access  Private
const updateCatway = async (req, res) => {
  try {
    const catway = await Catway.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    res.json({
      success: true,
      data: catway
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Partial update catway state
// @route   PATCH /api/catways/:id
// @access  Private
const updateCatwayState = async (req, res) => {
  try {
    const { catwayState } = req.body;
    
    const catway = await Catway.findByIdAndUpdate(
      req.params.id,
      { catwayState },
      { new: true, runValidators: true }
    );

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    res.json({
      success: true,
      data: catway
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete catway
// @route   DELETE /api/catways/:id
// @access  Private
const deleteCatway = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway non trouvé'
      });
    }

    // Vérifier s'il y a des réservations actives
    const Reservation = require('../models/Reservation');
    const activeReservations = await Reservation.findOne({
      catwayNumber: catway.catwayNumber,
      status: 'active'
    });

    if (activeReservations) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer un catway avec des réservations actives'
      });
    }

    await catway.deleteOne();

    res.json({
      success: true,
      message: 'Catway supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCatways,
  getCatway,
  createCatway,
  updateCatway,
  updateCatwayState,
  deleteCatway
};