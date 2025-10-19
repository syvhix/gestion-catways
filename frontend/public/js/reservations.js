let allReservations = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadReservations();
    await loadAvailableCatways();
    setupEventListeners();
});

async function loadReservations() {
    try {
        const response = await api.getReservations();
        allReservations = response.data;
        displayReservations(allReservations);
        
        document.getElementById('loadingMessage').classList.add('hidden');
        document.getElementById('reservationsList').classList.remove('hidden');
        
    } catch (error) {
        showError('Erreur lors du chargement des réservations: ' + error.message);
    }
}

async function loadAvailableCatways() {
    try {
        const response = await api.getCatways();
        const availableCatways = response.data.filter(catway => catway.isAvailable);
        
        const select = document.getElementById('modalReservationCatway');
        select.innerHTML = '<option value="">Sélectionnez un catway</option>';
        
        availableCatways.forEach(catway => {
            const option = document.createElement('option');
            option.value = catway._id;
            option.textContent = `Catway ${catway.catwayNumber} (${catway.type})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur chargement catways:', error);
    }
}

function displayReservations(reservations) {
    const tbody = document.getElementById('reservationsTableBody');
    
    if (reservations.length === 0) {
        document.getElementById('noReservationsMessage').classList.remove('hidden');
        document.getElementById('reservationsList').classList.add('hidden');
        return;
    }

    tbody.innerHTML = reservations.map(reservation => `
        <tr>
            <td>${reservation.catwayNumber}</td>
            <td>${reservation.clientName}</td>
            <td>${reservation.boatName}</td>
            <td>${new Date(reservation.checkIn).toLocaleDateString('fr-FR')}</td>
            <td>${new Date(reservation.checkOut).toLocaleDateString('fr-FR')}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(reservation.status)}">
                    ${reservation.status}
                </span>
            </td>
            <td>
                <a href="/reservation-details.html?catwayId=${findCatwayIdByNumber(reservation.catwayNumber)}&id=${reservation._id}" 
                   class="btn btn-primary btn-sm">
                    👁️ Voir
                </a>
                <button onclick="deleteReservation('${findCatwayIdByNumber(reservation.catwayNumber)}', '${reservation._id}')" 
                        class="btn btn-danger btn-sm">
                    🗑️ Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

function findCatwayIdByNumber(catwayNumber) {
    // Cette fonction devrait récupérer l'ID du catway à partir de son numéro
    // Pour l'instant, on retourne une valeur par défaut
    return 'default-catway-id';
}

function setupEventListeners() {
    // Recherche en temps réel
    document.getElementById('searchReservations').addEventListener('input', filterReservations);
    document.getElementById('filterStatus').addEventListener('change', filterReservations);
    document.getElementById('filterDate').addEventListener('change', filterReservations);

    // Formulaire de création
    document.getElementById('modalCreateReservationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createReservation();
    });
}

function filterReservations() {
    const searchTerm = document.getElementById('searchReservations').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const dateFilter = document.getElementById('filterDate').value;

    const filtered = allReservations.filter(reservation => {
        const matchesSearch = reservation.clientName.toLowerCase().includes(searchTerm) ||
                            reservation.boatName.toLowerCase().includes(searchTerm) ||
                            reservation.catwayNumber.toString().includes(searchTerm);
        const matchesStatus = !statusFilter || reservation.status === statusFilter;
        const matchesDate = !dateFilter || 
                           reservation.checkIn.startsWith(dateFilter) ||
                           reservation.checkOut.startsWith(dateFilter);

        return matchesSearch && matchesStatus && matchesDate;
    });

    displayReservations(filtered);
}

async function createReservation() {
    try {
        const catwayId = document.getElementById('modalReservationCatway').value;
        const reservationData = {
            clientName: document.getElementById('modalClientName').value,
            boatName: document.getElementById('modalBoatName').value,
            checkIn: document.getElementById('modalCheckIn').value,
            checkOut: document.getElementById('modalCheckOut').value
        };

        // Validation des dates
        const checkIn = new Date(reservationData.checkIn);
        const checkOut = new Date(reservationData.checkOut);
        
        if (checkIn >= checkOut) {
            showMessage('La date de départ doit être après la date d\'arrivée', 'error');
            return;
        }

        if (checkIn < new Date()) {
            showMessage('La date d\'arrivée doit être dans le futur', 'error');
            return;
        }

        const response = await api.createReservation(catwayId, reservationData);
        
        if (response.success) {
            closeModal('createReservationModal');
            showMessage('Réservation créée avec succès !', 'success');
            await loadReservations(); // Recharger la liste
            await loadAvailableCatways(); // Recharger les catways disponibles
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
}

async function deleteReservation(catwayId, reservationId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
        const response = await api.deleteReservation(catwayId, reservationId);
        
        if (response.success) {
            showMessage('Réservation supprimée avec succès !', 'success');
            await loadReservations(); // Recharger la liste
            await loadAvailableCatways(); // Recharger les catways disponibles
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
}

// Fonctions modales (déjà définies dans catways.js, mais on les redéfinit au cas où)
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    // Réinitialiser le formulaire
    document.getElementById(modalId).querySelector('form').reset();
}

function showMessage(message, type) {
    // Implémentation basique - à améliorer avec un système de notifications
    alert(`${type.toUpperCase()}: ${message}`);
}

function showError(message) {
    document.getElementById('loadingMessage').innerHTML = 
        `<p class="alert alert-error">${message}</p>`;
}