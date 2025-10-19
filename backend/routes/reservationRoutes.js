const express = require('express');
const { getReservations } = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

const router = express.Router();

router.get('/', protect, validatePagination, getReservations);

module.exports = router;