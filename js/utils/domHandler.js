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
 * @param {string} message - A mensagem a ser exibida.
 * @param {boolean} isError - True se a mensagem for um erro, false caso contrário.
 */
const displayResult = (message, isError = false) => {
    // Verifica se resultDiv existe antes de tentar manipular (para login.html)
    if (resultDiv) {
        resultDiv.innerHTML = `<p style="color: ${isError ? 'red' : 'green'};">${message}</p>`;
    } else {
        // Se estiver em login.html, pode logar no console ou usar um elemento específico lá.
        console.log(`[Display Result - ${isError ? 'ERROR' : 'INFO'}]: ${message}`);
    }
};

/**
 * Atualiza o texto e o estilo do status de login na UI.
 * @param {boolean} isAuthenticated - Se o usuário está autenticado.
 * @param {string | null} userName - O nome do usuário, se autenticado.
 */
const updateLoginStatusDisplay = (isAuthenticated, userName = null) => {
    // Verifica se loginStatusSpan existe antes de tentar manipular (para login.html)
    if (loginStatusSpan) {
        if (isAuthenticated) {
            loginStatusSpan.textContent = `Logado como: ${userName}`;
            loginStatusSpan.classList.remove('status-not-logged-in');
            loginStatusSpan.classList.add('status-logged-in');
        } else {
            loginStatusSpan.textContent = 'Não logado';
            loginStatusSpan.classList.remove('status-logged-in');
            loginStatusSpan.classList.add('status-not-logged-in');
        }
    }
};

export { displayResult, updateLoginStatusDisplay };