let currentReservation = null;
let currentCatwayId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadReservationDetails();
});

async function loadReservationDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('id');
    currentCatwayId = urlParams.get('catwayId');

    if (!reservationId || !currentCatwayId) {
        showError('ID de réservation ou catway manquant dans l\'URL');
        return;
    }

    try {
        const response = await api.getReservation(currentCatwayId, reservationId);
        currentReservation = response.data;
        displayReservationDetails(currentReservation);
        
        document.getElementById('loadingMessage').classList.add('hidden');
        document.getElementById('reservationDetails').classList.remove('hidden');
        
    } catch (error) {
        showError('Erreur lors du chargement de la réservation: ' + error.message);
    }
}

function displayReservationDetails(reservation) {
    document.getElementById('reservationTitle').textContent = 
        `Réservation #${reservation._id.slice(-6)}`;
    
    document.getElementById('reservationCatway').textContent = reservation.catwayNumber;
    document.getElementById('reservationClient').textContent = reservation.clientName;
    document.getElementById('reservationBoat').textContent = reservation.boatName;
    document.getElementById('reservationStatus').innerHTML = 
        `<span class="badge badge-${getStatusBadgeClass(reservation.status)}">${reservation.status}</span>`;
    
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    document.getElementById('reservationCheckIn').textContent = checkIn.toLocaleDateString('fr-FR');
    document.getElementById('reservationCheckOut').textContent = checkOut.toLocaleDateString('fr-FR');
    document.getElementById('reservationDuration').textContent = `${duration} jour(s)`;
    document.getElementById('reservationCreatedAt').textContent = 
        new Date(reservation.createdAt).toLocaleDateString('fr-FR');

    // Pré-remplir le formulaire d'édition
    document.getElementById('editClientName').value = reservation.clientName;
    document.getElementById('editBoatName').value = reservation.boatName;
    document.getElementById('editCheckIn').value = reservation.checkIn.split('T')[0];
    document.getElementById('editCheckOut').value = reservation.checkOut.split('T')[0];
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'active': return 'success';
        case 'completed': return 'secondary';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

function showEditReservationForm() {
    document.getElementById('editReservationForm').classList.remove('hidden');
}

function hideEditReservationForm() {
    document.getElementById('editReservationForm').classList.add('hidden');
}

async function cancelReservation() {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
        const updateData = {
            ...currentReservation,
            status: 'cancelled'
        };

        const response = await api.updateReservation(currentCatwayId, currentReservation._id, updateData);
        
        if (response.success) {
            showMessage('Réservation annulée avec succès !', 'success');
            await loadReservationDetails(); // Recharger les détails
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
}

async function deleteReservation() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette réservation ?')) return;

    try {
        const response = await api.deleteReservation(currentCatwayId, currentReservation._id);
        
        if (response.success) {
            showMessage('Réservation supprimée avec succès !', 'success');
            setTimeout(() => {
                window.location.href = '/reservations.html';
            }, 1000);
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
}

// Gestion du formulaire de modification
document.getElementById('editReservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const updateData = {
            clientName: document.getElementById('editClientName').value,
            boatName: document.getElementById('editBoatName').value,
            checkIn: document.getElementById('editCheckIn').value,
            checkOut: document.getElementById('editCheckOut').value
        };

        const response = await api.updateReservation(currentCatwayId, currentReservation._id, updateData);
        
        if (response.success) {
            showMessage('Réservation modifiée avec succès !', 'success');
            hideEditReservationForm();
            await loadReservationDetails(); // Recharger les détails
        }
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    }
});

function showMessage(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-2`;
    alertDiv.textContent = message;
    
    document.getElementById('reservationDetails').prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function showError(message) {
    document.getElementById('loadingMessage').classList.add('hidden');
    document.getElementById('errorMessage').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
}