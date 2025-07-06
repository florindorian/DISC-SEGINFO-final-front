// =============================================================
// Adiciona função para atualizar o status de login na UI.
// =============================================================
// Entrada: Nenhuma (define e exporta funções de utilidade DOM)
// Saída: Objeto (domHandler com métodos)

// Obtém referências aos elementos DOM. Agora, estas referências serão buscadas
// apenas na página que as contiver (index.html).
const resultDiv = document.getElementById('result');
const loginStatusSpan = document.getElementById('loginStatus');

/**
 * Exibe uma mensagem na div de resultados da página.
 * Esta função deve ser usada nas páginas que têm um #result.
 * @param {string} message - A mensagem a ser exibida.
 * @param {boolean} isError - True se a mensagem for um erro, false caso contrário.
 */
const displayResult = (message, isError = false) => {
    if (resultDiv) {
        resultDiv.innerHTML = `<p class="${isError ? 'error-message' : 'success-message'}">${message}</p>`;
    } else {
        console.log(`[DOMHandler - ${isError ? 'ERROR' : 'INFO'}]: ${message}`);
    }
};

/**
 * Atualiza o texto e o estilo do status de login na UI.
 * @param {boolean} isAuthenticated - Se o usuário está autenticado.
 * @param {string | null} userName - O nome do usuário, se autenticado.
 */
const updateLoginStatusDisplay = (isAuthenticated, userName = null) => {
    if (loginStatusSpan) {
        loginStatusSpan.textContent = isAuthenticated ? `Logado como: ${userName}` : 'Não logado';
        loginStatusSpan.classList.toggle('status-logged-in', isAuthenticated);
        loginStatusSpan.classList.toggle('status-not-logged-in', !isAuthenticated);
    }
};

export { displayResult, updateLoginStatusDisplay };