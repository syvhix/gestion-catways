// Au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        // Charger les données utilisateur
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('userName').textContent = user.name;
        }

        // Charger les statistiques
        await loadStats();
        
        // Charger les activités récentes
        await loadRecentActivities();

    } catch (error) {
        console.error('Erreur chargement dashboard:', error);
    }
}

async function loadStats() {
    try {
        const [catwaysResponse, reservationsResponse] = await Promise.all([
            api.getCatways(),
            api.getReservations()
        ]);

        const statsContent = document.getElementById('statsContent');
        statsContent.innerHTML = `
            <p>📊 <strong>${catwaysResponse.data.length}</strong> catways</p>
            <p>📅 <strong>${reservationsResponse.data.length}</strong> réservations</p>
            <p>✅ <strong>${catwaysResponse.data.filter(c => c.isAvailable).length}</strong> catways disponibles</p>
        `;
    } catch (error) {
        document.getElementById('statsContent').innerHTML = 
            '<p class="alert alert-error">Erreur chargement statistiques</p>';
    }
}

async function loadRecentActivities() {
    // Implémentation des activités récentes
    const activitiesDiv = document.getElementById('recentActivities');
    activitiesDiv.innerHTML = `
        <p>• Nouvelle réservation #1234</p>
        <p>• Catway #2 modifié</p>
        <p>• Utilisateur créé</p>
    `;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// Gestion des formulaires
document.getElementById('createCatwayForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Implémentation création catway
});

// Vérification authentification sur les pages protégées
if (!localStorage.getItem('authToken') && !window.location.pathname.includes('index.html')) {
    window.location.href = '/index';
}