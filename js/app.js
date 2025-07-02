// Entrada: Nenhuma (inicializa e associa eventos)
// Saída: void
import { getGreeting, postData, scheduleEvent, checkAuthStatus, importEventsFromSheet, logout} from './api/apiService.js';
import { displayResult, updateLoginStatusDisplay } from './utils/domHandler.js';


// Função para lidar com o clique do botão "Obter Saudação"
async function handleGetGreeting() {
    try {
        const greeting = await getGreeting();
        console.log('GET /: ', greeting);
        displayResult(`Saudação recebida: "${greeting}"`);
    } catch (error) {
        console.error('Erro ao obter saudação:', error);
        displayResult(`Erro ao obter saudação: ${error.message}`, true);
    }
}

// Função para lidar com o clique do botão "Enviar Dados"
async function handlePostData() {
    const dataToSend = {
        nome: "Usuário Teste",
        idade: Math.floor(Math.random() * 50) + 20, // Idade aleatória
        cidade: "Minha Cidade"
    };

    try {
        const result = await postData(dataToSend);
        console.log('POST /dados: ', result);
        displayResult(`Dados enviados com sucesso! Resposta: ${JSON.stringify(result)}`);
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        displayResult(`Erro ao enviar dados: ${error.message}`, true);
    }
}

// Função para lidar com o clique do botão "Agendar Evento"
async function handleScheduleEvent() {
    const title = document.getElementById('eventTitle').value;
    const year = parseInt(document.getElementById('eventYear').value, 10);
    const month = parseInt(document.getElementById('eventMonth').value, 10);
    const day = parseInt(document.getElementById('eventDay').value, 10);

    if (!title || isNaN(year) || isNaN(month) || isNaN(day)) {
        displayResult('Por favor, preencha todos os campos do evento.', true);
        return;
    }

    try {
        const result = await scheduleEvent({ title, year, month, day });
        console.log('POST /schedule-event: ', result);
        displayResult(`Evento agendado com sucesso! <a href="${result.eventLink}" target="_blank">Ver no Google Calendar</a>`);
    } catch (error) {
        console.error('Erro ao agendar evento:', error);
        displayResult(`Erro ao agendar evento: ${error.message}`, true);
    }
}

async function handleCheckAuth() {
    try {
        const status = await checkAuthStatus();
        console.log('GET /check-auth: ', status);
        if (status.authenticated) {
            displayResult(`Autenticado como: ${status.user.name} (${status.user.email})`);
            updateLoginStatusDisplay(true, status.user.name);
            updateLoginButtonVisibility(true); // Mostra Logout, esconde Login
        } else {
            displayResult(`Não autenticado: ${status.message}`, true);
            updateLoginStatusDisplay(false);
            updateLoginButtonVisibility(false); // Mostra Login, esconde Logout
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        displayResult(`Erro ao verificar autenticação: ${error.message}`, true);
        updateLoginStatusDisplay(false);
        updateLoginButtonVisibility(false); // Mostra Login, esconde Logout
    }
}

async function handleGoogleLogin() {
    window.location.href = 'http://localhost:3001/auth/google';
}


async function handleLogout() {
    displayResult('Realizando logout...');
    try {
        await logout(); // Chama o endpoint de logout no backend
        localStorage.removeItem('appJwt'); // Limpa o token do localStorage
        updateLoginStatusDisplay(false); // Atualiza status para não logado
        updateLoginButtonVisibility(false); // Ajusta visibilidade dos botões
        displayResult('Logout realizado com sucesso!');
        console.log('Logout completo. JWT removido do localStorage.');
    } catch (error) {
        console.error('Erro ao realizar logout:', error);
        displayResult(`Erro ao realizar logout: ${error.message}`, true);
    }
}

// =============================================================
// Função para controlar a visibilidade dos botões de Login/Logout
// =============================================================
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');

function updateLoginButtonVisibility(isAuthenticated) {
    if (isAuthenticated) {
        googleLoginBtn.style.display = 'none'; // Esconde Login
        logoutBtn.style.display = 'inline-block'; // Mostra Logout
    } else {
        googleLoginBtn.style.display = 'inline-block'; // Mostra Login
        logoutBtn.style.display = 'none'; // Esconde Logout
    }
}


const checkAndSetLoginStatus = async () => {
    const token = localStorage.getItem('appJwt');
    if (token) {
        try {
            const status = await checkAuthStatus();
            updateLoginStatusDisplay(status.authenticated, status.user ? status.user.name : null);
            updateLoginButtonVisibility(status.authenticated); // ATUALIZA VISIBILIDADE NO INÍCIO
        } catch (error) {
            console.warn('Verificação de status inicial falhou, usuário não autenticado:', error.message);
            localStorage.removeItem('appJwt');
            updateLoginStatusDisplay(false);
            updateLoginButtonVisibility(false); // ATUALIZA VISIBILIDADE
        }
    } else {
        updateLoginStatusDisplay(false);
        updateLoginButtonVisibility(false); // ATUALIZA VISIBILIDADE
    }
};


// Função para lidar com o clique do botão "Importar Eventos da Planilha"
async function handleImportEvents() {
    const spreadsheetIdInput = document.getElementById('spreadsheetIdInput').value.trim();
    const sheetNameInput = document.getElementById('sheetNameInput').value.trim();

    // Validação no front-end para garantir que o ID da planilha foi fornecido
    if (!spreadsheetIdInput) {
        displayResult('Por favor, insira o ID da Planilha Google.', true);
        return;
    }
    if (!sheetNameInput) {
        displayResult('Por favor, insira o Nome da Aba (ex: Sheet1).', true);
        return;
    }

    displayResult(`Importando eventos da planilha "${spreadsheetIdInput}" na aba "${sheetNameInput}"...`);

    try {
        const result = await importEventsFromSheet(spreadsheetIdInput, sheetNameInput); // Passa os inputs
        console.log('POST /sheets/import-events: ', result);
        let successMessage = `Importação concluída! ${result.processedEvents.length} eventos processados.`;
        if (result.processedEvents.length > 0) {
             successMessage += `<br>Verifique seu Google Calendar e a planilha.`;
        }
        displayResult(successMessage);
    } catch (error) {
        console.error('Erro ao importar eventos da planilha:', error);
        displayResult(`Erro ao importar eventos da planilha: ${error.message}`, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('getGreetingBtn').addEventListener('click', handleGetGreeting);
    document.getElementById('postDataBtn').addEventListener('click', handlePostData);
    document.getElementById('checkAuthBtn').addEventListener('click', handleCheckAuth);
    document.getElementById('scheduleEventBtn').addEventListener('click', handleScheduleEvent);
    document.getElementById('googleLoginBtn').addEventListener('click', handleGoogleLogin);
    document.getElementById('importEventsBtn').addEventListener('click', handleImportEvents);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Chama a verificação e atualização de status no carregamento inicial da página
    checkAndSetLoginStatus();
});

document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash.includes('access_token=')) {
        const token = hash.split('access_token=')[1].split('&')[0];
        console.log('JWT recebido na URL hash:', token);
        localStorage.setItem('appJwt', token);
        history.replaceState(null, '', window.location.pathname + window.location.search);
        displayResult('Autenticação com Google e sua aplicação concluída! Token recebido e armazenado.');
        // Chama a verificação e atualização de status novamente após o login bem-sucedido
        checkAndSetLoginStatus(); // Re-checa para atualizar status e visibilidade dos botões
    }
});