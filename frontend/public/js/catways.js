let allCatways = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadCatways();
    setupEventListeners();
});

async function loadCatways() {
    try {
        const response = await api.getCatways();
        allCatways = response.data;
        displayCatways(allCatways);
        
        document.getElementById('loadingMessage').classList.add('hidden');
        document.getElementById('catwaysList').classList.remove('hidden');
        
    } catch (error) {
        showError('Erreur lors du chargement des catways: ' + error.message);
    }
}

function displayCatways(catways) {
    const tbody = document.getElementById('catwaysTableBody');
    
    if (catways.length === 0) {
        document.getElementById('noCatwaysMessage').classList.remove('hidden');
        document.getElementById('catwaysList').classList.add('hidden');
        return;
    }

    tbody.innerHTML = catways.map(catway => `
        <tr>
            <td>${catway.catwayNumber}</td>
            <td>
                <span class="badge ${catway.type === 'long' ? 'badge-primary' : 'badge-secondary'}">
                    ${catway.type}
                </span>
            </td>
            <td>${catway.catwayState}</td>
            <td>
                <span class="badge ${catway.isAvailable ? 'badge-success' : 'badge-warning'}">
                    ${catway.isAvailable ? 'Disponible' : 'Occupé'}
                </span>
            </td>
            <td>
                <a href="/catway-details.html?id=${catway._id}" class="btn btn-primary btn-sm">
                    👁️ Voir
                </a>
                <button onclick="editCatway('${catway._id}')" class="btn btn-secondary btn-sm">
                    ✏️ Modifier
                </button>
                <button onclick="deleteCatway('${catway._id}')" class="btn btn-danger btn-sm">
                    🗑️ Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    // Recherche en temps réel
    document.getElementById('searchCatways').addEventListener('input', filterCatways);
    document.getElementById('filterType').addEventListener('change', filterCatways);
    document.getElementById('filterAvailability').addEventListener('change', filterCatways);

    // Formulaire de création
    document.getElementById('modalCreateCatwayForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createCatway();
    });
}

function filterCatways() {
    const searchTerm = document.getElementById('searchCatways').value.toLowerCase();
    const typeFilter = document.getElementById('filterType').value;
    const availabilityFilter = document.getElementById('filterAvailability').value;

    const filtered = allCatways.filter(catway => {
        const matchesSearch = catway.catwayNumber.toString().includes(searchTerm) ||
                            catway.catwayState.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || catway.type === typeFilter;
        const matchesAvailability = !availabilityFilter || 
            (availabilityFilter === 'available' && catway.isAvailable) ||
            (availabilityFilter === 'occupied' && !catway.isAvailable);

        return matchesSearch && matchesType && matchesAvailability;
    });

    displayCatways(filtered);
}

async function createCatway() {
    try {
        const catwayData = {
            catwayNumber: parseInt(document.getElementById('modalCatwayNumber').value),
            type: document.getElementById('modalCatwayType').value,
            catwayState: document.getElementById('modalCatwayState').value
        };

        const response = await api.createCatway(catwayData);
        
        if (response.success) {
            closeModal('createCatwayModal');
            showMessage('Catway créé avec succès !', 'success');
            await loadCatways(); // Recharger la liste
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
}

async function deleteCatway(catwayId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce catway ?')) return;

    try {
        const response = await api.deleteCatway(catwayId);
        
        if (response.success) {
            showMessage('Catway supprimé avec succès !', 'success');
            await loadCatways(); // Recharger la liste
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
}

// Fonctions modales
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showMessage(message, type) {
    // Implémentation d'un système de notifications
    alert(`${type.toUpperCase()}: ${message}`);
}

function showError(message) {
    document.getElementById('loadingMessage').innerHTML = 
        `<p class="alert alert-error">${message}</p>`;
}