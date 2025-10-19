class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur API');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // Catways endpoints
    async getCatways() {
        return this.request('/catways');
    }

    async getCatway(id) {
        return this.request(`/catways/${id}`);
    }

    async createCatway(catwayData) {
        return this.request('/catways', {
            method: 'POST',
            body: JSON.stringify(catwayData)
        });
    }

    async updateCatway(id, catwayData) {
        return this.request(`/catways/${id}`, {
            method: 'PUT',
            body: JSON.stringify(catwayData)
        });
    }

    async updateCatwayState(id, catwayState) {
        return this.request(`/catways/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ catwayState })
        });
    }

    async deleteCatway(id) {
        return this.request(`/catways/${id}`, {
            method: 'DELETE'
        });
    }

    // Reservations endpoints
    async getReservations() {
        return this.request('/reservations');
    }

    async createReservation(catwayId, reservationData) {
        return this.request(`/catways/${catwayId}/reservations`, {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
    }

    async deleteReservation(catwayId, reservationId) {
        return this.request(`/catways/${catwayId}/reservations/${reservationId}`, {
            method: 'DELETE'
        });
    }
}

// Instance globale de l'API
const api = new ApiClient();