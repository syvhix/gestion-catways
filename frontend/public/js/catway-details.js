let currentCatway = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadCatwayDetails();
});

async function loadCatwayDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const catwayId = urlParams.get('id');

    if (!catwayId) {
        showError('ID de catway manquant dans l\'URL');
        return;
    }

    try {
        const response = await api.getCatway(catwayId);
        currentCatway = response.data;
        displayCatwayDetails(currentCatway);
        
        document.getElementById('loadingMessage').classList.add('hidden');
        document.getElementById('catwayDetails').classList.remove('hidden');
        
    } catch (error) {
        showError('Erreur lors du chargement du catway: ' + error.message);
    }
}

function displayCatwayDetails(catway) {
    document.getElementById('catwayTitle').textContent = `Catway ${catway.catwayNumber}`;
    document.getElementById('catwayNumber').textContent = catway.catwayNumber;
    document.getElementById('catwayType').textContent = catway.type;
    document.getElementById('catwayState').textContent = catway.catwayState;
    document.getElementById('catwayAvailability').innerHTML = 
        `<span class="badge ${catway.isAvailable ? 'badge-success' : 'badge-warning'}">
            ${catway.isAvailable ? 'Disponible' : 'Occupé'}
        </span>`;
    document.getElementById('catwayCreatedAt').textContent = 
        new Date(catway.createdAt).toLocaleDateString('fr-FR');
}

function showEditStateForm() {
    document.getElementById('editStateForm').classList.remove('hidden');
    document.getElementById('newCatwayState').value = currentCatway.catwayState;
}

function hideEditStateForm() {
    document.getElementById('editStateForm').classList.add('hidden');
}

function showReservationForm() {
    document.getElementById('reservationForm').classList.remove('hidden');
}

function hideReservationForm() {
    document.getElementById('reservationForm').classList.add('hidden');
}

// Gestion du formulaire de modification d'état
document.getElementById('editStateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const newState = document.getElementById('newCatwayState').value;
        const response = await api.updateCatwayState(currentCatway._id, newState);
        
        if (response.success) {
            showMessage('État du catway mis à jour avec succès !', 'success');
            hideEditStateForm();
            await loadCatwayDetails(); // Recharger les détails
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
});

// Gestion du formulaire de réservation
document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const reservationData = {
            clientName: document.querySelector('#reservationForm input[type="text"]').value,
            boatName: document.querySelectorAll('#reservationForm input[type="text"]')[1].value,
            checkIn: document.querySelector('#reservationForm input[type="date"]').value,
            checkOut: document.querySelectorAll('#reservationForm input[type="date"]')[1].value
        };

        const response = await api.createReservation(currentCatway._id, reservationData);
        
        if (response.success) {
            showMessage('Réservation créée avec succès !', 'success');
            hideReservationForm();
            await loadCatwayDetails(); // Recharger les détails
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
});

async function deleteCatway() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce catway ? Cette action est irréversible.')) return;

    try {
        const response = await api.deleteCatway(currentCatway._id);
        
        if (response.success) {
            showMessage('Catway supprimé avec succès !', 'success');
            setTimeout(() => {
                window.location.href = '/catways.html';
            }, 1000);
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
}

function showMessage(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-2`;
    alertDiv.textContent = message;
    
    document.getElementById('catwayDetails').prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function showError(message) {
    document.getElementById('loadingMessage').classList.add('hidden');
    document.getElementById('errorMessage').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
}