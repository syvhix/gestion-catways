# 🏖️ Gestion Catways - Port de Russell

![GitHub Actions](https://github.com/votre-username/gestion-catways/actions/workflows/deploy.yml/badge.svg)
![Render](https://gestion-catways.onrender.com/)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

Application web complète de gestion des réservations de catways pour le port de plaisance de Russell. Développée avec une architecture moderne et des technologies robustes.

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies Utilisées](#️-technologies-utilisées)
- [🚀 Installation et Démarrage](#-installation-et-démarrage)
- [📁 Structure du Projet](#-structure-du-projet)
- [🔗 API Endpoints](#-api-endpoints)
- [🎯 Utilisation](#-utilisation)
- [🧪 Tests](#-tests)
- [🌐 Déploiement](#-déploiement)
- [📊 Base de Données](#-base-de-données)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)
- [👨‍💻 Auteur](#-auteur)

## ✨ Fonctionnalités

### 🔐 Authentification Sécurisée
- Inscription et connexion utilisateurs
- JWT (JSON Web Tokens) pour l'authentification
- Sessions sécurisées

### ⚓ Gestion des Catways
- ✅ Création, lecture, modification, suppression (CRUD) des catways
- ✅ Gestion des types (long/court) et états
- ✅ Interface intuitive pour la gestion

### 📅 Gestion des Réservations
- ✅ Réservation de catways avec validation des dates
- ✅ Prévention des chevauchements de réservations
- ✅ Gestion des clients et bateaux
- ✅ Tableau de bord des réservations

### 🎨 Interface Moderne
- ✅ Design responsive (mobile et desktop)
- ✅ Navigation intuitive
- ✅ Tableau de bord avec statistiques
- ✅ Documentation API intégrée

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Environnement d'exécution
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashage des mots de passe
- **Swagger** - Documentation API

### Frontend
- **HTML5/CSS3** - Structure et style
- **JavaScript Vanilla** - Interactivité
- **Fetch API** - Communication avec le backend

### Outils
- **Nodemon** - Redémarrage automatique en développement
- **Jest** - Tests unitaires
- **Supertest** - Tests d'API
- **MongoDB Atlas** - Base de données cloud

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 16.x ou supérieur
- npm ou yarn
- Compte MongoDB Atlas

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/gestion-catways.git
cd gestion-catways
Installer les dépendances

bash
npm install
Configuration
Configurer les variables d'environnement

bash
cp .env.example .env
Modifier le fichier .env

env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/catways_db
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRES_IN=30d
NODE_ENV=development
Démarrage
Mode Développement

bash
npm run dev
L'application sera accessible sur http://localhost:3000

Mode Production

bash
npm start
Import des données de test

bash
npm run import-data
📁 Structure du Projet
text
gestion-catways/
├── backend/
│   ├── config/          # Configuration MongoDB
│   ├── controllers/     # Logique métier
│   ├── models/          # Modèles de données
│   ├── routes/          # Routes API
│   ├── middleware/      # Middlewares (auth, validation)
│   ├── tests/           # Tests automatisés
│   ├── scripts/         # Scripts utilitaires
│   └── server.js        # Point d'entrée
├── frontend/
│   └── public/
│       ├── css/         # Styles
│       ├── js/          # JavaScript client
│       ├── index.html   # Page d'accueil
│       ├── dashboard.html
│       └── ...
├── .github/workflows/   # CI/CD
└── package.json
🔗 API Endpoints
Authentification
Method	Endpoint	Description
POST	/api/auth/register	Créer un compte
POST	/api/auth/login	Connexion
GET	/api/auth/me	Profil utilisateur
Catways
Method	Endpoint	Description
GET	/api/catways	Liste des catways
GET	/api/catways/:id	Détails d'un catway
POST	/api/catways	Créer un catway
PUT	/api/catways/:id	Modifier un catway
PATCH	/api/catways/:id	Modifier l'état
DELETE	/api/catways/:id	Supprimer un catway
Réservations
Method	Endpoint	Description
GET	/api/catways/:id/reservations	Réservations d'un catway
POST	/api/catways/:id/reservations	Créer une réservation
DELETE	/api/catways/:id/reservations/:resId	Supprimer une réservation
📚 Documentation complète : http://localhost:3000/api-docs

🎯 Utilisation
Première utilisation
Accédez à l'application : http://localhost:3000

Créez un compte administrateur

Connectez-vous avec vos identifiants

Accédez au tableau de bord

Gestion des Catways
Ajouter un catway via le formulaire dédié

Consulter la liste dans l'onglet "Catways"

Modifier l'état depuis les détails d'un catway

Supprimer si nécessaire (uniquement sans réservations actives)

Gestion des Réservations
Créer une réservation depuis un catway disponible

Vérifier les disponibilités automatiquement

Gérer les réservations depuis l'onglet dédié

Annuler ou supprimer les réservations

🧪 Tests
Lancer les tests unitaires

bash
npm test
Tests avec couverture

bash
npm run test:coverage
Tests en mode watch

bash
npm run test:watch
🌐 Déploiement
Déploiement sur Heroku
Installer Heroku CLI

Se connecter

bash
heroku login
Créer l'application

bash
heroku create votre-app-catways
Configurer les variables d'environnement

bash
heroku config:set MONGODB_URI=votre_uri_mongodb_atlas
heroku config:set JWT_SECRET=votre_secret_jwt
Déployer

bash
git push heroku main
Déploiement sur Render
Connecter le repository GitHub

Configurer les variables d'environnement

Déployer automatiquement

📊 Base de Données
Modèles
User

name (String) - Nom complet

email (String) - Email unique

password (String) - Mot de passe hashé

role (String) - Rôle utilisateur

Catway

catwayNumber (Number) - Numéro unique

type (String) - "long" ou "short"

catwayState (String) - Description de l'état

isAvailable (Boolean) - Disponibilité

Reservation

catwayNumber (Number) - Référence au catway

clientName (String) - Nom du client

boatName (String) - Nom du bateau

checkIn (Date) - Date d'arrivée

checkOut (Date) - Date de départ

status (String) - Statut de la réservation

🤝 Contribution
Forker le projet

Créer une branche (git checkout -b feature/ma-fonctionnalite)

Commiter les changements (git commit -m 'Ajouter ma fonctionnalité')

Pousser la branche (git push origin feature/ma-fonctionnalite)

Ouvrir une Pull Request

📄 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

👨‍💻 Auteur
Votre Nom

GitHub: @votre-username

Email: votre.email@example.com