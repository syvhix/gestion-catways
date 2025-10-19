// Configuration de l'API selon l'environnement
const API_CONFIG = {
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : '/api'  // Relatif en production
};

class ApiClient {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.token = localStorage.getItem('authToken');
    }
    
    // ... le reste de votre code ApiClient
}

const api = new ApiClient();