const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const connectDB = require('./config/database');

// Connexion à la base de données
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ CORRECTION : Servir les fichiers statiques AVANT les routes
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestion Catways - Port de Russell',
      version: '1.0.0',
      description: 'API pour la gestion des catways et réservations du port de plaisance de Russell'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? `https://${process.env.RENDER_EXTERNAL_URL || 'votre-app.render.com'}` 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Serveur de production' : 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./backend/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/catways', require('./routes/catwayRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// ✅ CORRECTION : Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// ✅ CORRECTION : Routes pour toutes les pages HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/dashboard.html'));
});

app.get('/catways', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/catways.html'));
});

app.get('/reservations', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/reservations.html'));
});

app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/documentation.html'));
});

// ✅ CORRECTION : Routes pour les détails avec paramètres
app.get('/catway-details', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/catway-details.html'));
});

app.get('/reservation-details', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/reservation-details.html'));
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des routes non trouvées
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`
  });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur interne'
  });
});

// Ne démarrer le serveur que si le fichier est exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📚 Documentation API: http://localhost:${PORT}/api-docs`);
      console.log(`🌐 Frontend: http://localhost:${PORT}`);
    });
  });
}

module.exports = app;