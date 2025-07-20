// =============================================================
// Lógica para a página de login.
// =============================================================
import { FRONT_BASE_URL } from './config.js';
import { API_BASE_URL } from './api/apiConfig.js';
const loginMessageDiv = document.getElementById('loginMessage');

// Sobrescreve a função displayResult APENAS para login.js
// para que ela direcione as mensagens para loginMessageDiv
// E para que a mensagem de "Faça login..." seja diferente do erro.
const displayLoginMessage = (message, isError = false) => {
    if (loginMessageDiv) {
        loginMessageDiv.innerHTML = `<p style="color: ${isError ? 'red' : 'green'};">${message}</p>`;
    } else {
        console.log(`[Display Login Message - ${isError ? 'ERROR' : 'INFO'}]: ${message}`);
    }
};


async function handleGoogleLogin() {
    // URL do endpoint de autenticação OAuth do back-end
    const authUrl = `${API_BASE_URL}/auth/google`;
    console.log(`Redirecionando para: ${authUrl}`);
    
    window.location.href = authUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }

    const hash = window.location.hash;
    if (hash.includes('access_token=')) {
        // Fluxo de SUCESSO após OAuth
        const token = hash.split('access_token=')[1].split('&')[0];
        console.log('JWT recebido no hash da URL (em login.js):', token);
        localStorage.setItem('appJwt', token); // Salva o token
        history.replaceState(null, '', window.location.pathname + window.location.search); // Limpa o hash

        displayLoginMessage('Login bem-sucedido! Redirecionando para a página principal...', false);
        // Redireciona para a página principal após salvar o token
        window.location.href = `${FRONT_BASE_URL}/index.html`;
    } else if (hash.includes('error=')) {
        // Fluxo de ERRO após OAuth
        const errorMessage = decodeURIComponent(hash.split('error=')[1].split('&')[0]);
        displayLoginMessage(`Erro no login: ${errorMessage}. Por favor, tente novamente.`, true);
        history.replaceState(null, '', window.location.pathname + window.location.search); // Limpa o hash
    } else {
        // Estado inicial da página de login
        displayLoginMessage('Faça login para acessar as funcionalidades.', false);
    }
});