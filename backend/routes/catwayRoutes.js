const express = require('express');
const {
  getCatways,
  getCatway,
  createCatway,
  updateCatway,
  updateCatwayState,
  deleteCatway
} = require('../controllers/catwayController');

const {
  getCatwayReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation
} = require('../controllers/reservationController');

const { protect } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Routes publiques
router.get('/', validatePagination, getCatways);
router.get('/:id', validateObjectId, getCatway);

// Routes protégées
router.post('/', protect, createCatway);
router.put('/:id', protect, validateObjectId, updateCatway);
router.patch('/:id', protect, validateObjectId, updateCatwayState);
router.delete('/:id', protect, validateObjectId, deleteCatway);

// Sous-routes pour les réservations
router.get('/:id/reservations', validateObjectId, getCatwayReservations);
router.get('/:id/reservations/:reservationId', validateObjectId, getReservation);
router.post('/:id/reservations', protect, validateObjectId, createReservation);
router.put('/:id/reservations/:reservationId', protect, validateObjectId, updateReservation);
router.delete('/:id/reservations/:reservationId', protect, validateObjectId, deleteReservation);

module.exports = router;