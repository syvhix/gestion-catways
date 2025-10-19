const mongoose = require('mongoose');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const connectDB = require('../config/database');

require('dotenv').config();

const catwaysData = [
  {
    catwayNumber: 1,
    type: 'long',
    catwayState: 'Bon état'
  },
  {
    catwayNumber: 2,
    type: 'short', 
    catwayState: 'Nécessite entretien'
  },
  {
    catwayNumber: 3,
    type: 'long',
    catwayState: 'Excellent état'
  }
];

const reservationsData = [
  {
    catwayNumber: 1,
    clientName: 'Jean Dupont',
    boatName: 'Sea Breeze',
    checkIn: new Date('2024-06-01'),
    checkOut: new Date('2024-06-10')
  },
  {
    catwayNumber: 2,
    clientName: 'Marie Martin',
    boatName: 'Ocean Dream', 
    checkIn: new Date('2024-06-05'),
    checkOut: new Date('2024-06-15')
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Nettoyer les collections existantes
    await Catway.deleteMany();
    await Reservation.deleteMany();

    // Importer les données
    await Catway.insertMany(catwaysData);
    await Reservation.insertMany(reservationsData);

    console.log('✅ Données importées avec succès');
    process.exit();
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    process.exit(1);
  }
};

importData();