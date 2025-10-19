function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
}

// Gestion connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await api.login(email, password);
        
        if (response.success) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            showMessage('Connexion réussie ! Redirection...', 'success');
            
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// Gestion inscription
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await api.register(name, email, password);
        
        if (response.success) {
            showMessage('Compte créé avec succès ! Vous pouvez vous connecter.', 'success');
            showLogin();
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// Vérification si déjà connecté
if (localStorage.getItem('authToken') && window.location.pathname === '/index.html') {
    window.location.href = '/dashboard.html';
}