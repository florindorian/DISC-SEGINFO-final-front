// =============================================================
// Adiciona função para atualizar o status de login na UI.
// =============================================================
// Entrada: Nenhuma (define e exporta funções de utilidade DOM)
// Saída: Objeto (domHandler com métodos)
const resultDiv = document.getElementById('result');
const loginStatusSpan = document.getElementById('loginStatus'); // Referência ao span de status

/**
 * Exibe uma mensagem na div de resultados da página.
 * @param {string} message - A mensagem a ser exibida.
 * @param {boolean} isError - True se a mensagem for um erro, false caso contrário.
 */
const displayResult = (message, isError = false) => {
    resultDiv.innerHTML = `<p style="color: ${isError ? 'red' : 'green'};">${message}</p>`;
};

/**
 * Atualiza o texto e o estilo do status de login na UI.
 * @param {boolean} isAuthenticated - Se o usuário está autenticado.
 * @param {string | null} userName - O nome do usuário, se autenticado.
 */
// Entrada: isAuthenticated (Boolean), userName (String ou null)
// Saída: void (atualiza o DOM)
const updateLoginStatusDisplay = (isAuthenticated, userName = null) => {
    if (isAuthenticated) {
        loginStatusSpan.textContent = `Logado como: ${userName}`;
        loginStatusSpan.classList.remove('status-not-logged-in');
        loginStatusSpan.classList.add('status-logged-in');
    } else {
        loginStatusSpan.textContent = 'Não logado';
        loginStatusSpan.classList.remove('status-logged-in');
        loginStatusSpan.classList.add('status-not-logged-in');
    }
};


export { displayResult, updateLoginStatusDisplay };