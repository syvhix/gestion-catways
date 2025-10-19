const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Maintenant app est exporté
const Catway = require('../models/Catway');
const User = require('../models/User');

let token;
let server;

// Démarrer le serveur avant tous les tests
beforeAll(async () => {
  // Le serveur est déjà créé via l'import de app
  // Nettoyer la base de données
  await User.deleteMany();
  await Catway.deleteMany();
  
  // Créer un utilisateur de test
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  // Obtenir le token via l'API
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });

  token = response.body.data.token;
});

// Nettoyer après chaque test
afterEach(async () => {
  await Catway.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Catways', () => {
  test('GET /api/catways - devrait retourner tous les catways', async () => {
    // Préparer les données de test
    await Catway.create([
      { catwayNumber: 1, type: 'long', catwayState: 'Bon état' },
      { catwayNumber: 2, type: 'short', catwayState: 'Excellent état' }
    ]);

    const response = await request(app)
      .get('/api/catways')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].catwayNumber).toBe(1);
    expect(response.body.data[1].catwayNumber).toBe(2);
  });

  test('GET /api/catways/:id - devrait retourner un catway spécifique', async () => {
    const catway = await Catway.create({
      catwayNumber: 5,
      type: 'long',
      catwayState: 'Test état'
    });

    const response = await request(app)
      .get(`/api/catways/${catway._id}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.catwayNumber).toBe(5);
    expect(response.body.data.type).toBe('long');
  });

  test('POST /api/catways - devrait créer un nouveau catway', async () => {
    const catwayData = {
      catwayNumber: 10,
      type: 'long',
      catwayState: 'Nouveau catway en test'
    };

    const response = await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send(catwayData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.catwayNumber).toBe(10);
    expect(response.body.data.type).toBe('long');
    expect(response.body.data.catwayState).toBe('Nouveau catway en test');
  });

  test('POST /api/catways - devrait échouer sans authentification', async () => {
    const catwayData = {
      catwayNumber: 10,
      type: 'long',
      catwayState: 'Nouveau catway'
    };

    const response = await request(app)
      .post('/api/catways')
      .send(catwayData)
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  test('PUT /api/catways/:id - devrait mettre à jour un catway', async () => {
    const catway = await Catway.create({
      catwayNumber: 15,
      type: 'short',
      catwayState: 'État initial'
    });

    const updateData = {
      catwayNumber: 15,
      type: 'short',
      catwayState: 'État modifié'
    };

    const response = await request(app)
      .put(`/api/catways/${catway._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.catwayState).toBe('État modifié');
  });

  test('DELETE /api/catways/:id - devrait supprimer un catway', async () => {
    const catway = await Catway.create({
      catwayNumber: 20,
      type: 'long',
      catwayState: 'À supprimer'
    });

    const response = await request(app)
      .delete(`/api/catways/${catway._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('supprimé');

    // Vérifier que le catway n'existe plus
    const deletedCatway = await Catway.findById(catway._id);
    expect(deletedCatway).toBeNull();
  });
});